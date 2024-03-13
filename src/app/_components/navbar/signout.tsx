"use client";

import { signOut } from "next-auth/react";

export function Signout({ children }: { children: React.ReactNode }) {
  return <div onClick={() => signOut()}>{children}</div>;
}
