"use client";

import {
  Dashboard,
  People,
  ReportProblem,
  Settings,
} from "@mui/icons-material";
import { Cctv, ChevronDown } from "lucide-react";
import Image from "next/image";
import { ReactElement, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = "Dashboard" | "Camera" | "Scenes" | "Incidents" | "Users";

export default function Navbar({ navlist }: { navlist: NavItem[] }) {
  const pathname = usePathname();

  const routeNameMap: Record<string, NavItem | null> = {
    "/dashboard": "Dashboard",
    "/camera": "Camera",
    "/scenes": "Scenes",
    "/incidents": "Incidents",
    "/users": "Users",
    "/": null,
  };

  const activeRoute = routeNameMap[pathname] || null;

  const icons: Record<NavItem, ReactElement> = {
    Dashboard: (
      <Dashboard
        style={{ color: "Dashboard" === activeRoute ? "#facc15" : "white" }}
      />
    ),
    Camera: (
      <Cctv style={{ color: "Camera" === activeRoute ? "#facc15" : "white" }} />
    ),
    Scenes: (
      <Settings
        style={{ color: "Scenes" === activeRoute ? "#facc15" : "white" }}
      />
    ),
    Incidents: (
      <ReportProblem
        style={{ color: "Incidents" === activeRoute ? "#facc15" : "white" }}
      />
    ),
    Users: (
      <People
        style={{ color: "Users" === activeRoute ? "#facc15" : "white" }}
      />
    ),
  };

  return (
    <nav className="flex font-jakarta items-center justify-between text-white py-6 mx-6">
      <div>
        <Link href="/" className="flex items-center justify-between gap-2">
          <Image src="/logo.png" alt="Logo" width={20} height={20} />
          <h1>
            MANDLAC<span className="font-extrabold">X</span>
          </h1>
        </Link>
      </div>

      <ul className="flex flex-1 justify-center items-center space-x-8 text-xs font-semibold">
        {navlist.map((item, index) => (
          <li key={index}>
            <Link
              href={`/${item.toLowerCase()}`}
              className="flex justify-center items-center gap-2"
            >
              {icons[item]}
              <span>{item}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-2 text-[#F5F5F5] cursor-pointer">
        <Image
          src="/user.jpg"
          alt="user"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />

        <div className="flex flex-col items-start">
          <p className="text-sm font-semibold">Current User</p>
          <p className="text-xs">user@example.com</p>
        </div>

        <div>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </nav>
  );
}
