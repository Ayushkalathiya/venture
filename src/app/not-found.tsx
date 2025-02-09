'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 text-transparent bg-clip-text">404</h1>
          <h2 className="text-2xl font-semibold">Lost in the Waves?</h2>
          <p className="text-gray-700 dark:text-gray-300">The page you&apos;re looking for doesn&apos;t exist. Maybe you took a wrong turn?</p>
          <Button asChild>
            <Link href="/">Back to Safety</Link>
          </Button>
        </div>
      </div>
    );
  }