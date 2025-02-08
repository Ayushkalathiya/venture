"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

export function SearchFormClient() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { credits, updateCredits } = useCredits();
  const { data: session } = useSession();
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.email) {
      toast.error("Please login to continue")
      return
    }

    // Check if user has credits using context
    if (credits <= 0) {
      toast.error("You've run out of credits. Please purchase more to continue.")
      return
    }

    setResponse(null);
    setIsLoading(true);
    setIsError(false);
    
    try {
      const res = await gemin(query);
      
      if (res.error) {
        toast.error(res.error);
        setResponse("Invalid search. Please try with a different query.")
        setIsError(true);
      } else {
        if (res !== false) {
          // Deduct credit and update database
          const newCredits = credits - 1
          const updateResult = await updateUserCredits(session.user.id, newCredits)
          
          if (updateResult.success) {
            // Update context with new credits
            updateCredits(newCredits)
            setResponse(res.result)
            toast.success(`Search successful! Credits remaining: ${newCredits}`)
          } else {
            toast.error("Failed to update credits. Please try again.")
            return
          }
        } else {
          setResponse("Invalid prompt. Please provide more specific details about your startup or needs.")
          setIsError(true);
          toast.error("Invalid prompt. Please try again with more details.")
        }
      }
    } catch(e) {
      console.error(e)
      toast.error("An error occurred. Please try again.")
      setResponse("Something went wrong. Please try again.")
      setIsError(true);
    } finally {
      setIsLoading(false)
    }
  }

  // Show credit status
  const renderCreditStatus = () => {
    return (
      <div className={`text-sm ${credits <= 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
        Available Credits: {credits}
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
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
        <div className="mt-6 space-y-4 px-4">
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
          <Skeleton className="h-4 w-[70%]" />
        </div>
      )}

      {!isLoading && response && (
        <div className={cn(
          "mt-6 p-6 rounded-xl transition-all duration-200",
          "border-2",
          isError 
            ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800" 
            : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800",
          "shadow-sm"
        )}>
          <p className={cn(
            "text-base leading-relaxed",
            isError 
              ? "text-red-800 dark:text-red-200" 
              : "text-gray-800 dark:text-gray-200"
          )}>
            {response}
          </p>
        </div>
      )}
    </div>
  )
}

