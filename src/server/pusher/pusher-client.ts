import Pusher from "pusher-js";

export interface PusherClientSettings {
  app_key: string;
  app_host: string;
  app_port: number;
}

const pusher = (
  settings: PusherClientSettings,
  authEndpoint?: string,
): Pusher => {
  return new Pusher(settings.app_key, {
    wsHost: settings.app_host,
    wsPort: settings.app_port,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
    cluster: "eu",
    channelAuthorization: authEndpoint
      ? { transport: "ajax", endpoint: authEndpoint }
      : undefined,
  });
};

export default pusher;
