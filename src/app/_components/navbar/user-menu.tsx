"use server";

import React from "react";
import { getServerAuthSession } from "~/server/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Signout } from "./signout";
import Link from "next/link";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const NavUserMenu = async () => {
  const session = await getServerAuthSession();

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative m-auto h-8 w-8 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image ?? ""} alt="@shadcn" />
              <AvatarFallback />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/settings">
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Signout>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </Signout>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="m-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative m-auto h-8 w-8 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuGroup>
            <Link href="/api/auth/signin">
              <DropdownMenuItem>Login</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavUserMenu;
