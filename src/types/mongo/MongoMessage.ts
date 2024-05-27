import MongoConversation from "./MongoConversation";
import MongoUser from "./MongoUser";

export default interface MongoMessage {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  
  isSelf:boolean;

  sender: MongoUser;
  viewers: MongoUser[];
  body: string;
  image: string;
  
  conversation: MongoConversation;
}
