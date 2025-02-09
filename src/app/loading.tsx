import { Loader2 } from "lucide-react";

// Loading Page
export default function LoadingPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-16 h-16 animate-spin mx-auto text-blue-600 dark:text-teal-400" />
        <p className="text-xl font-semibold">Hold tight! We&apos;re preparing something amazing for you.</p>
      </div>
    </div>
  );
}