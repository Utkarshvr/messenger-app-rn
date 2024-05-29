import { Pusher } from "@pusher/pusher-websocket-react-native";
import { useEffect, useState } from "react";

export default function usePusher() {
  const pusher = Pusher.getInstance();
  const [isConnected, setIsConnected] = useState(false);

  const initiatePusher = async () => {
    await pusher.init({
      apiKey: process.env.EXPO_PUBLIC_PUSHER_APP_KEY!,
      cluster: "ap2",
    });

    pusher.connect().then(() => setIsConnected(true));
  };

  useEffect(() => {
    initiatePusher();
  }, []);

  return { isConnected, pusher };
}
