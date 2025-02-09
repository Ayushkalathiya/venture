"use client";

import { gemin } from "@/app/home/action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCredits } from "@/context/credits-context";
import { updateUserCredits } from "@/lib/actions/user-actions";
import { cn } from "@/lib/utils";
import { Loader2, SearchIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// AnimatedResponse component
const AnimatedResponse = ({ text }: { text: string }) => {
  const sections = text.split("\n\n").filter(Boolean);
  const [visibleSections, setVisibleSections] = useState(0);

  useEffect(() => {
    if (visibleSections < sections.length) {
      const timer = setTimeout(() => {
        setVisibleSections((prev) => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [visibleSections, sections.length]);

  // Function to highlight mentor name
  const formatMentorName = (content: string) => {
    if (content.includes("SELECTED MENTOR:")) {
      const [label, name] = content.split(":");
      return (
        <>
          <span className="text-gray-500 dark:text-gray-400">{label}:</span>
          <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 text-transparent bg-clip-text animate-pulse">
            {name.trim().replace(/\*\*/g, "")}
          </span>
        </>
      );
    }
    return content;
  };

  // Function to swap colors in expertise sections
  const formatBulletPoint = (text: string) => {
    const cleanText = text.replace(/\*\*/g, "");

    // For expertise sections, swap the colors
    if (
      sections[0].includes("EXPERTISE MATCH") ||
      sections[0].includes("VALUE PROPOSITION") ||
      sections[0].includes("COLLABORATION POTENTIAL")
    ) {
      return (
        <span className="text-blue-700 dark:text-blue-300 font-medium">
          {cleanText}
        </span>
      );
    }

    return (
      <span className="text-gray-700 dark:text-gray-300">{cleanText}</span>
    );
  };

  return (
    <div className="space-y-6">
      {sections.slice(0, visibleSections).map((section, index) => {
        const [title, ...content] = section.split("\n");
        const isHeader = title.includes(":");
        const [headerText, headerContent] = isHeader
          ? title.split(":")
          : [title, ""];

        return (
          <div key={index} className="mb-6 last:mb-0 opacity-0 animate-fade-in">
            {isHeader ? (
              <div className="mb-4">
                <h3 className="text-xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 text-transparent bg-clip-text">
                    {headerText.trim()}
                  </span>
                  {headerContent && (
                    <span className="block mt-1">
                      {formatMentorName(
                        headerText.trim() + ":" + headerContent
                      )}
                    </span>
                  )}
                </h3>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{title}</p>
            )}

            {content.length > 0 && (
              <ul className="mt-3 space-y-3">
                {content.map((item, i) => {
                  const bulletPoint = item.trim().replace(/^-\s*/, "");
                  if (!bulletPoint) return null;

                  return (
                    <li key={i} className="flex items-start space-x-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 flex-shrink-0" />
                      {formatBulletPoint(bulletPoint)}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
      {visibleSections < sections.length && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating insights...</span>
        </div>
      )}
    </div>
  );
};

export function SearchFormClient() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecharging, setIsRecharging] = useState(false);
  const [isError, setIsError] = useState(false);
  const { credits, updateCredits } = useCredits();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.email) {
      toast.error("Please login to continue");
      return;
    }

    if (credits <= 0) {
      // Send recharge email
      const response = await fetch("/api/send-recharge-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (response.ok) {
        toast.error(
          "Your credits are exhausted. Please check your email to recharge."
        );
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

      if (!res || (typeof res === "object" && "error" in res)) {
        setIsError(true);
        setResponse(
          !res
            ? "We couldn't process your request. Please provide more specific details about your startup needs."
            : `Error: ${res.error}. Please try a different search query.`
        );
        toast.error(!res ? "Invalid search query" : res.error);
        setIsLoading(false);
        return;
      }

      // Only deduct credits if search was successful
      const newCredits = credits - 1;
      const updateResult = await updateUserCredits(
        session.user.id,
        newCredits,
        false
      );

      if (!updateResult.success) {
        toast.error(
          updateResult.error || "Failed to update credits. Please try again."
        );
        setIsLoading(false);
        return;
      }

      // Update UI after successful credit deduction
      updateCredits(newCredits);
      setResponse(res.result);
      toast.success(`Search successful! Credits remaining: ${newCredits}`);
    } catch (err) {
      console.error("Search error:", err);
      setResponse("An unexpected error occurred. Please try again later.");
      setIsError(true);
      toast.error("Something went wrong with your search");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!session?.user?.email) {
      toast.error("Please login to continue");
      return;
    }

    setIsRecharging(true);
    try {
      // First attempt to recharge credits
      const response = await fetch('/api/recharge-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Credits recharged successfully, now send confirmation email
        const emailResponse = await fetch('/api/send-recharge-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: session.user.email,
            type: 'confirmation',
            credits: data.credits 
          }),
        });

        if (emailResponse.ok) {
          toast.success("Credits recharged successfully! Check your email for confirmation.");
        } else {
          toast.success("Credits recharged successfully! (Email confirmation failed)");
        }
        
        updateCredits(data.credits);
      } else {
        if (data.error.includes('already used your one-time recharge')) {
          toast.error("You've already used your one-time recharge. Please contact support for more credits.");
          
          // Send support instructions email
          const emailResponse = await fetch('/api/send-recharge-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email: session.user.email,
              type: 'support'
            }),
          });

          if (emailResponse.ok) {
            toast.info("Check your email for support instructions");
          }
        } else {
          toast.error(data.error || "Failed to recharge credits");
        }
      }
    } catch (error) {
      toast.error("Failed to process recharge request");
      console.error(error);
    } finally {
      setIsRecharging(false);
    }
  };

  // Show credit status
  const renderCreditStatus = () => {
    return (
      <div className="flex items-center justify-between">
        <div
          className={`text-sm ${
            credits <= 0 ? "text-red-500" : "text-muted-foreground"
          }`}
        >
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
            ) : (
              "Recharge Credits"
            )}
          </Button>
        )}
      </div>
    );
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
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>

      {isLoading && (
        <Card className="mt-6 p-6">
          <div className="space-y-4">
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-gray-100 dark:bg-gray-900 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {!isLoading && response && (
        <Card
          className={cn(
            "mt-6 transition-all duration-200",
            isError
              ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
              : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50",
            "shadow-sm hover:shadow-md"
          )}
        >
          <div className="p-6">
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-2">
              <AnimatedResponse text={response} />
            </div>
          </div>
          <div className="px-6 py-4 border-t bg-gray-50/50 dark:bg-gray-900/30 rounded-b-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Credits remaining: {credits}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
