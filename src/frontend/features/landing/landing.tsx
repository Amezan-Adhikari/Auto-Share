"use client";

import { authClient } from "@/app/lib/auth-client";

import Link from "next/link";
import Button from "../../shared/components/Button";
import Navbar from "../../shared/components/navbar";

export default function Landing() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <div className="container mx-auto max-w-6xl px-5">
      <Navbar />
      <div className="mt-16 space-y-4">
        <h1
          className={`text-[32px] leading-[130%] bg-linear-to-r from-black to-gray-500 text-transparent bg-clip-text w-max font-bold font-[playfairDisplay]`}
        >
          Apply IPO with a single click. <br />
          Manage Multiple Accounts Effortlessly.
        </h1>
        <p className="max-w-xl mb-8">
          Auto Share safely stores your data and helps you in applying IPO
          forms. If you have multiple accounts, Auto share helps you apply and
          manage all those accounts too.
        </p>

        {session ? (
          <Link href="/dashboard" className="">
            <Button variant="primary" className=" p-3 px-8">
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/" className="">
            <Button variant="primary" className="p-3 px-8">
              Get Started
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
