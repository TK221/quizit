import Pusher from "pusher";
import { env } from "~/env";

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  host: env.PUSHER_APP_HOST,
  port: env.PUSHER_APP_PORT,
  useTLS: false,
});

export default pusher;
