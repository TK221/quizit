import React from "react";
import ThemeToggle from "./theme-toggle";
import { NavNavigation } from "./nav-navigation";
import NavUserMenu from "./user-menu";

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-14 items-center px-4">
        <NavNavigation className="mr-auto" />
        <div className="flex space-x-4">
          <ThemeToggle />
          <NavUserMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
