import MongoUser from "./MongoUser";

export default interface MongoFriendRequest {
  _id: string;
  createdAt: string;
  updatedAt: string;
  isSeenByReceiver: boolean;
  no_of_attempts: number;
  recipient: string;
  sender: MongoUser;
  status: "pending" | "accepted" | "rejected" | "unfriend";
}
