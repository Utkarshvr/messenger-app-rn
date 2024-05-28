import { Pusher } from "@pusher/pusher-websocket-react-native";

const pusher = Pusher.getInstance();

export const initiatePusher = async () => {
  await pusher.init({
    apiKey: process.env.EXPO_PUBLIC_PUSHER_APP_KEY!,
    cluster: "ap2",
  });

  await pusher.connect();
};

export default pusher;
