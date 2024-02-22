import React from "react";
import Trigger from "../_components/trigger";
import { env } from "~/env";
import { unstable_noStore } from "next/cache";

const Test = () => {
  unstable_noStore();

  return (
    <div>
      <Trigger
        pusherSettings={{
          app_host: env.CLIENT_PUSHER_APP_HOST,
          app_key: env.PUSHER_APP_KEY,
          app_port: env.CLIENT_PUSHER_APP_PORT,
        }}
      />
    </div>
  );
};

export default Test;
