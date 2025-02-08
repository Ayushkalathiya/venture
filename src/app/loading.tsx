import { Loader2 } from "lucide-react";

// Loading Page
export default function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="text-center space-y-4">
        <Loader2 className="w-16 h-16 animate-spin mx-auto text-blue-600 dark:text-teal-400" />
        <p className="text-xl font-semibold">Hold tight! We&aspos;re preparing something amazing for you.</p>
      </div>
    </div>
  );
}