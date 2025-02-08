"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/home" });
      
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      variant="outline"
      className="flex items-center space-x-2"
    >
      <Image
        src="/google.png" // You can use an actual Google logo SVG
        alt="Google Logo"
        width={20}
        height={20}
      />
      <span>Sign in with Google</span>
    </Button>
  );
}
