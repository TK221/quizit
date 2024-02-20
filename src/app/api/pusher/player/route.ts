import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import pusher from "~/server/pusher/pusher-server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const socket_id = formData.get("socket_id")?.toString();
  const channel_name = formData.get("channel_name")?.toString();

  if (!socket_id || !channel_name) {
    return NextResponse.json(
      { error: "socket_id and channel_name are required" },
      { status: 400 },
    );
  }

  const auth = pusher.authorizeChannel(socket_id, channel_name);

  return Response.json(auth);
}
