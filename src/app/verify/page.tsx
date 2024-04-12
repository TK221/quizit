import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { profiles } from "~/server/db/schema";

const Verify = async () => {
  const session = await getServerAuthSession();

  if (session) {
    await db
      .insert(profiles)
      .values({ userId: session.user.id })
      .onConflictDoNothing();
  }

  redirect("/");
};

export default Verify;
