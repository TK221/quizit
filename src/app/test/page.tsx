import React from "react";
import Trigger from "../_components/trigger";
import { env } from "~/env";

const Test = () => {
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
