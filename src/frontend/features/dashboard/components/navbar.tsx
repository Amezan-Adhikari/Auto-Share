"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  LayoutDashboard,
  LogOut,
  MoveRightIcon,
  Trash,
  User,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import Button from "@/frontend/shared/components/Button";

const navLinks = [
  { name: "Dashboard", link: "/dashboard" },
  { name: "Accounts", link: "/dashboard/accounts" },
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  async function handleSignOut() {
    const res = await authClient.signOut();
    if (res.data?.success) {
      router.push("/");
      toast.success("Logged Out Successfully.");
    }
  }

  return (
    <div className="flex pt-10 justify-between items-center">
      <Link href={"/"}>
        <Image height={20} width={150} src={"/Logo.svg"} alt="auto share" />
      </Link>

      <div className="gap-10 flex items-center font-medium font-inter">
        {navLinks.map((link, index) => (
          <Link
            className="hover:underline active:scale-[0.98]"
            key={link.name + index}
            href={link.link}
          >
            {link.name}
          </Link>
        ))}

        {/* Right Section */}
        <div className="flex items-center gap-8">
          {isPending ? (
            <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-md" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-4 cursor-pointer justify-between min-w-[170px] hover:bg-gray-200 p-2 px-3 rounded-xl bg-gray-100 items-center">
                  <span className="text-sm truncate">Hi, {session.user.name}</span>

                  {/* <Link href="/dashboard" className="flex gap-2 group items-center">
                <Button variant="secondary" className="text-sm group-hover:text-blue-600 underline p-1">
                  Go to Dashboard
                </Button>
                <ArrowRight size={16} className="group-hover:text-blue-600"/>
              </Link> */}
                  <Avatar className="bg-black text-white flex items-center justify-center">
                    {session.user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuItem
                    variant="destructive"
                    className="group cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <div className="flex gap-2 p-1 items-center">
                      <LogOut /> Sign Out{" "}
                      <ArrowRight size={16} className="group-hover:ml-1" />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hover:underline active:scale-[0.98]"
              >
                Sign In
              </Link>

              <Link href="/sign-up">
                <Button variant="primary" className="text-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
