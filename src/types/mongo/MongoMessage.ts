import MongoConversation from "./MongoConversation";
import MongoUser from "./MongoUser";

export default interface MongoMessage<T = MongoUser | MongoConversation> {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  isSelf: boolean;

  sender: T extends MongoUser ? MongoUser : string;
  viewers: T extends MongoUser ? MongoUser[] : string[];
  body: string;
  image: string;

  conversation: T extends MongoConversation ? MongoConversation : string;
}
