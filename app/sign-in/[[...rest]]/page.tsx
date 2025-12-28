"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function SignInPage() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />;
    </div>
  );
}
