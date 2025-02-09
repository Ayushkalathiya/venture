"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { gemin } from "@/app/home/action"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { SearchIcon, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { updateUserCredits } from "@/lib/actions/user-actions"
import { useCredits } from "@/context/credits-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SearchFormClient() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecharging, setIsRecharging] = useState(false);
  const [isError, setIsError] = useState(false);
  const { credits, updateCredits } = useCredits();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.email) {
      toast.error("Please login to continue")
      return
    }

    if (credits <= 0) {
      // Send recharge email
      const response = await fetch('/api/send-recharge-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (response.ok) {
        toast.error("Your credits are exhausted. Please check your email to recharge.");
      } else {
        toast.error("You've run out of credits. Please contact support.");
      }
      return;
    }

    setResponse(null);
    setIsLoading(true);
    setIsError(false);
    
    try {
      // First perform the search
      const res = await gemin(query);
      
      if (!res) {
        setIsError(true);
        toast.error("Invalid prompt. Please try again with more details.");
        return;
      }

      if (typeof res === 'object' && 'error' in res) {
        setIsError(true);
        toast.error(res.error);
        return;
      }

      // If search was successful, then deduct credit
      const newCredits = credits - 1;
      const updateResult = await updateUserCredits(session.user.id, newCredits, false);
      
      if (!updateResult.success) {
        toast.error(updateResult.error || "Failed to update credits. Please try again.");
        return;
      }

      // Update context with new credits and show response
      updateCredits(newCredits);
      setResponse(res.result);
      toast.success(`Search successful! Credits remaining: ${newCredits}`);

    } catch (err) {
      console.error('Search error:', err);
      toast.error("An error occurred. Please try again.");
      setResponse("Something went wrong. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRecharge = async () => {
    if (!session?.user?.email) {
      toast.error("Please login to continue");
      return;
    }

    setIsRecharging(true);
    try {
      const response = await fetch('/api/recharge-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Credits recharged successfully!");
        updateCredits(data.credits);
      } else {
        if (data.error.includes('already used your one-time recharge')) {
          toast.error("You've already used your one-time recharge. Please contact support for more credits.");
          
          const emailResponse = await fetch('/api/send-recharge-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: session.user.email }),
          });

          if (emailResponse.ok) {
            toast.info("Check your email for support instructions");
          }
        } else {
          toast.error(data.error || "Failed to recharge credits");
        }
      }
    } catch (error) {
      toast.error("Failed to process recharge request" + error);
    } finally {
      setIsRecharging(false);
    }

  };

  // Show credit status
  const renderCreditStatus = () => {
    return (
      <div className="flex items-center justify-between">
        <div className={`text-sm ${credits <= 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
          Available Credits: {credits}
        </div>
        {credits <= 0 && (
          <Button
            onClick={handleRecharge}
            variant="outline"
            size="sm"
            className="ml-4"
            disabled={isRecharging}
          >
            {isRecharging ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Recharging...
              </span>
            ) : "Recharge Credits"}
          </Button>
        )}
      </div>
    );
  };

  const formatResponse = (text: string) => {
    // Highlight topics (text before colon)
    const highlightTopic = (paragraph: string) => {
      return paragraph.replace(
        /^([^:]+):\s*/,
        '<topic>$1</topic>'
      );
    };

    // Only highlight mentor/investor names
    const highlightNames = (paragraph: string) => {
      const names = ['Rajesh Kumar', 'Rajesh']; // Add your mentor/investor names here
      const namePattern = new RegExp(`\\b(${names.join('|')})\\b`, 'g');
      return paragraph.replace(namePattern, '<name>$1</name>');
    };

    return text.split('\n').map((paragraph, index) => {
      if (!paragraph.trim()) return null;

      // Check if it's a bullet point
      const isBulletPoint = paragraph.trim().startsWith('-');
      const cleanParagraph = paragraph.trim().replace(/^-\s*/, '');
      
      // Process the text with both highlighting functions
      const processedText = highlightTopic(highlightNames(cleanParagraph));
      const parts = processedText.split(/<(topic|name)>|<\/(topic|name)>/);

      return (
        <div key={index} className={cn(
          "group flex items-start",
          isBulletPoint ? "ml-6 my-3" : "my-4"
        )}>
          {isBulletPoint && (
            <div className="flex-shrink-0 w-6 h-6 -ml-6 mr-4 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-600" />
            </div>
          )}
          <div className="flex-grow">
            {parts.map((part, i) => {
              if (i % 3 === 1) {
                // This is a tag name (topic or name)
                const nextPart = parts[i + 1];
                switch (part) {
                  case 'topic':
                    return (
                      <div key={i} className="font-semibold text-lg text-blue-600 dark:text-blue-400 mb-3">
                        {nextPart}
                      </div>
                    );
                  case 'name':
                    return (
                      <Badge key={i} variant="secondary" className="mx-1 font-medium">
                        {nextPart}
                      </Badge>
                    );
                  default:
                    return nextPart;
                }
              } else if (i % 3 === 0) {
                // This is regular text
                return (
                  <span key={i} className="text-gray-700 dark:text-gray-200">
                    {part}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {session?.user && renderCreditStatus()}
        <div className="relative flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your startup or needs..."
              className={cn(
                "pl-10 pr-4 h-12 text-base transition-all duration-200",
                "border-2 focus:border-primary/50 hover:border-primary/30",
                "rounded-xl shadow-sm",
                isLoading && "opacity-70"
              )}
              disabled={isLoading || credits <= 0}
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || credits <= 0}
            className={cn(
              "h-12 px-6 rounded-xl",
              "transition-all duration-200",
              "bg-primary hover:bg-primary/90",
              "text-primary-foreground font-medium",
              "shadow-sm hover:shadow-md",
              "sm:w-auto w-full"
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </span>
            ) : "Search"}
          </Button>
        </div>
      </form>

      {isLoading && (
        <Card className="mt-6 p-6 space-y-4">
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
          <Skeleton className="h-4 w-[70%]" />
        </Card>
      )}

      {!isLoading && response && (
        <Card className={cn(
          "mt-6 transition-all duration-200",
          isError 
            ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800" 
            : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50",
          "shadow-sm hover:shadow-md"
        )}>
          <div className="p-6">
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-2">
              {formatResponse(response)}
            </div>
          </div>
          {!isError && (
            <div className="px-6 py-4 border-t bg-gray-50/50 dark:bg-gray-900/30 rounded-b-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Credits remaining: {credits}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

