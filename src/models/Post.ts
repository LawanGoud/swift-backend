import { Comment } from "./Comment";

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  comments?: Comment[];
}
