'use client';

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
// Error Page
export default function ErrorPage() {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto" />
          <h1 className="text-3xl font-bold">Oops! Something went wrong.</h1>
          <p className="text-gray-700 dark:text-gray-300">Don&aspos;t worry, we&aspos;re working on it. Please try again later.</p>
          <Button asChild>
            <Link href="/">Go Back Home</Link>
          </Button>
        </div>
      </div>
    );
  }
  