import { Router } from "express";
import {
  loadUsers,
  deleteAllUsers,
  deleteUserById,
  getUserById,
  addUser,
} from "../controllers/userController";
import { getUsers } from "../controllers/userController";

const router = Router();

router.get("/users", getUsers);
router.get("/load", loadUsers);
router.delete("/", deleteAllUsers);
router.delete("/:userId", deleteUserById);
router.get("/:userId", getUserById);
router.post("/", addUser);

export default router;
