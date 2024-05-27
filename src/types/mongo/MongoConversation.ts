import MongoUser from "./MongoUser";
import MongoMessage from "./MongoMessage";

export default interface MongoConversation {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  lastMessagedAt: Date;
  lastMessage: MongoMessage;

  isGroup: boolean;
  users: MongoUser[];
  deletedBy: MongoUser[];
  hasInitiated: boolean;
}
