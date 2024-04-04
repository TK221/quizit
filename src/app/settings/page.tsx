import React from "react";
import ProfileSettings from "../_components/profile-settings";
import { getServerAuthSession } from "~/server/auth";
import { redirectToLogin } from "~/lib/utils";

const Settings = async () => {
  const session = await getServerAuthSession();

  if (!session) return redirectToLogin();

  return (
    <div className="flex h-full items-center justify-center">
      <ProfileSettings username={session.user.name} />{" "}
    </div>
  );
};

export default Settings;
