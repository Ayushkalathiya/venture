'use client';

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { CreditsProvider, useCredits } from "@/context/credits-context";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Waves, Coins, LogOut, ChevronDown, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { credits, updateCredits } = useCredits();

  // Initialize credits from session
  useEffect(() => {
    if (session?.user?.credits !== undefined) {
      updateCredits(session.user.credits as number);
    }
  }, [session?.user?.credits, updateCredits]);

  // Function to render credit status with appropriate styling
  const renderCredits = () => {
    const isLowCredits = credits <= 3;

    return (
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
        isLowCredits 
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' 
          : 'bg-primary/10 border border-primary/20'
      }`}>
        {isLowCredits ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <Coins className="w-4 h-4 text-primary" />
        )}
        <span className={`text-sm font-medium ${isLowCredits ? '' : 'text-primary'}`}>
          {credits} Credits
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] via-[#e8eef1] to-[#dfe9f3] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-foreground transition-all">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Waves className="w-8 h-8 text-primary animate-wave" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-600 to-violet-600 dark:from-primary dark:via-blue-400 dark:to-violet-400 text-transparent bg-clip-text group-hover:bg-gradient-to-l transition-all duration-500">
                VentureWave
              </span>
              <span className="text-xs text-muted-foreground">Empowering Innovations</span>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {renderCredits()}
            
            <ModeToggle />

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-primary/10">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Image 
                          src={session.user.image || ''} 
                          alt="Profile" 
                          width={32} 
                          height={32}
                          className="rounded-full"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                      </div>
                      <span className="font-medium">{session.user?.name || "User"}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Coins className="w-4 h-4 mr-2" />
                    <span>{credits} Credits Remaining</span>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 dark:text-red-400"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="p-6 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Waves className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">VentureWave</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Made with 💙 for ambitious innovators | © 2025 VentureWave
          </p>
        </div>
      </footer>
    </div>
  );
}

// Wrap the layout with CreditsProvider
export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  
  return (
    <CreditsProvider initialCredits={session?.user?.credits as number || 0}>
      <LayoutContent>{children}</LayoutContent>
    </CreditsProvider>
  );
}