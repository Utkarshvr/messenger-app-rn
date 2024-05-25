import { EmailAddressResource } from "@clerk/types";

export default interface MongoUser {
  _id: string;
  username: string;
  email_addresses: EmailAddressResource[]; // Use appropriate type if you know the structure of email_addresses
  primaryEmailID?: string;
  picture?: string;
}
