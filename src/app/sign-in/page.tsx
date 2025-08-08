"use client";

import { ModeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Page() {
  const { data: session, status } = useSession();
  console.log("session login:", session);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div>
        <div className="fixed top-4 right-4">
          <ModeToggle />
        </div>

        <div className="flex justify-center items-center h-screen">
          <div className="w-80 flex flex-col items-center gap-4 bg-card border rounded-lg p-6 shadow-2xl">
            <h1 className="font-bold text-2xl text-primary">Merhabaaaaaaaa!</h1>
            <Avatar>
              {session.user?.image && (
                <AvatarImage
                  src={session.user.image}
                  alt={session.user.name ?? "User Avatar"}
                />
              )}
              <AvatarFallback className="text-3xl">
                {session.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold">{session.user?.name}</p>
            <p className="text-sm text-muted-foreground">
              {session.user?.email}
            </p>
            <Button
              onClick={() => signOut()}
              variant="destructive"
              className="mt-4"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <div className="fixed top-4 right-4">
          <ModeToggle />
        </div>

        <div className="flex justify-center items-center h-screen">
          <div className="w-72 flex flex-col items-center gap-6 bg-card border rounded-lg p-4 shadow-2xl py-8">
            <h1 className="font-bold text-2xl text-primary">Sign In Here!</h1>
            <Button
              onClick={() => signIn("google")}
              className="flex items-center gap-2 shadow-lg border-gray-200 border hover:scale-110 transition-all duration-500 cursor-pointer bg-white"
            >
              <FcGoogle />{" "}
              <span className="text-gray-700">Sign In with Google</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
