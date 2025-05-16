import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 }); // Cache expires in 60 seconds

// src/controllers/userController.ts
import type { Request, Response } from "express";
import axios from "axios";
import { getDb } from "../db";
import { User } from "../models/User";

export const loadUsersData = async () => {
  const db = getDb();

  const [usersRes, postsRes, commentsRes] = await Promise.all([
    axios.get("https://jsonplaceholder.typicode.com/users"),
    axios.get("https://jsonplaceholder.typicode.com/posts"),
    axios.get("https://jsonplaceholder.typicode.com/comments"),
  ]);

  const users = usersRes.data;
  const posts = postsRes.data;
  const comments = commentsRes.data;

  const usersWithPosts = users.map((user: any) => {
    const userPosts = posts
      .filter((post: any) => post.userId === user.id)
      .map((post: any) => {
        const postComments = comments.filter(
          (comment: any) => comment.postId === post.id
        );
        return { ...post, comments: postComments };
      });
    return { ...user, posts: userPosts };
  });

  // Clear existing data first
  await db.collection("users").deleteMany({});
  // Insert new users data
  await db.collection("users").insertMany(usersWithPosts);
};

// Controller method uses the above helper
export const loadUsers = async (req: Request, res: Response) => {
  try {
    await loadUsersData();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load users." });
  }
};
export const deleteAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = getDb();
    await db.collection("users").deleteMany({});
    res.json({ message: "All users deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete users." });
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = getDb();
    const userId = parseInt(req.params.userId);
    const result = await db.collection("users").deleteOne({ id: userId });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user." });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = getDb();
    const userId = parseInt(req.params.userId);

    const cached = cache.get(userId);
    if (cached) {
      res.json({ fromCache: true, data: cached });
      return;
    }

    const user = await db.collection("users").findOne({ id: userId });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    cache.set(userId, user);
    res.json({ fromCache: false, data: user });
  } catch (err) {
    res.status(500).json({ error: "Failed to get user." });
  }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const newUser: User = req.body;

    const existing = await db.collection("users").findOne({ id: newUser.id });
    if (existing) {
      res.status(400).json({ error: "User already exists." });
      return;
    }

    await db.collection("users").insertOne(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to add user." });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || "name";
    const order = req.query.order === "desc" ? -1 : 1;

    const users = await db
      .collection("users")
      .find()
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const totalUsers = await db.collection("users").countDocuments();

    res.json({
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
};
