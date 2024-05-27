import MongoConversation from "./MongoConversation";
import MongoUser from "./MongoUser";

export default interface MongoMessage {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  sender: string | MongoUser;
  viewers: string[] | MongoUser[];
  body: string;
  image: string;

  conversation: string | MongoConversation;
}
