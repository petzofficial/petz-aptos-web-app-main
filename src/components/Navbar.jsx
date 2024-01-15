"use client";

import React, { useEffect, useState } from "react";
import "../style/nav.scss";
import Image from "next/image";
import logo from "../../public/logo.png";
import Link from "next/link";
import { IoMdSettings } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { Outfit } from "next/font/google";
import { IoMdMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const outfit = Outfit({ subsets: ["latin"] });

const Navbar = ({ method }) => {
  const [responsive, setResponsive] = useState(false);
  return (
    <nav className="w-full bg-white fixed z-20 shadow-md py-1">
      <div className="navbar 2xl:px-5 lg:px-14 md:px-10 sm:px-6 max-sm:px-3">
        <Link href={"/home"}>
          <div className="logo flex items-center">
            <Image src={logo} width={60} height={60} alt="Logo" />
            <p>PetZ</p>
          </div>
        </Link>

        <div className={`pages max-md:hidden lg:flex ${outfit.className}`}>
          <Link href={"/task"}>
            <button
              className={`${method === "tasks" ? " text-[#FF6900]" : ""}`}
            >
              Tasks
            </button>
          </Link>
          <Link href={"/statistics"}>
            <button
              className={`${method === "statistics" ? " text-[#FF6900]" : ""}`}
            >
              Statistics
            </button>
          </Link>
          <Link href={"/account"}>
            <button
              className={`${method === "account" ? " text-[#FF6900]" : ""}`}
            >
              Account
            </button>
          </Link>
        </div>

        <div className="profile-setting">
          <Link href={"/setting"}>
            <button
              className={`${method === "setting" ? " text-[#FF6900]" : ""}`}
            >
              <IoMdSettings />
            </button>
          </Link>
          <Link href={"/notification"}>
            <button
              className={`${
                method === "notification" ? " text-[#FF6900]" : ""
              }`}
            >
              <IoNotifications />
            </button>
          </Link>
          <Link className="max-md:hidden lg:flex" href={"/"}>
            <button className="user-icon font-bold">Connect</button>
          </Link>
          <button
            onClick={() => setResponsive(!responsive)}
            className="text-[25px] text-[#2f2f2f] md:hidden"
          >
            {responsive ? <RxCross2 /> : <IoMdMenu />}
          </button>
        </div>
      </div>

      <div
        className={`mobile-navbar flex p-8 flex-col w-full transition-all duration-100 md:hidden overflow-hidden ${
          outfit.className
        } ${responsive ? "h-full" : "h-[0px] py-0"}`}
      >
        <Link href={"/statistics"}>
          <button
            className={`${method === "statistics" ? " text-[#FF6900]" : ""}`}
          >
            Statistics
          </button>
        </Link>
        <Link href={"/task"}>
          <button className={`${method === "tasks" ? " text-[#FF6900]" : ""}`}>
            Tasks
          </button>
        </Link>
        <Link href={"/account"}>
          <button
            className={`${method === "account" ? " text-[#FF6900]" : ""}`}
          >
            Account
          </button>
        </Link>
        <Link className="mt-3" href={"/"}>
          <button className="user-icon">Connect</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
