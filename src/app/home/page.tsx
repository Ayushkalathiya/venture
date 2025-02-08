import { SearchFormClient } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { Suspense } from "react";
import { Sparkles, Users, Rocket, ArrowRight } from "lucide-react";
import { AuthCheckClient } from "@/components/auth-check";


function FeatureCard({ icon: Icon, title, description }: { 
  icon: any, 
  title: string, 
  description: string 
}) {
  return (
    <div className="p-6 rounded-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center gap-4 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthCheckClient>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-violet-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 text-foreground transition-all">
        <main className="container mx-auto px-4 py-12 space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Matching
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-violet-400">
              Find Your Perfect Mentor or Investor
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leverage AI to connect with the right people who can help grow your startup. Get matched based on your specific needs and goals.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <SearchFormClient />
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FeatureCard 
              icon={Rocket}
              title="Smart Matching"
              description="AI-powered algorithm finds the perfect mentor based on your startup's unique needs"
            />
            <FeatureCard 
              icon={Users}
              title="Expert Network"
              description="Access to a curated network of experienced mentors and investors"
            />
            <FeatureCard 
              icon={ArrowRight}
              title="Quick Connect"
              description="Get connected with your matches instantly and start your journey"
            />
          </div>

          <div className="max-w-5xl mx-auto w-full">
            <Suspense
              fallback={
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 rounded-xl bg-background/60 animate-pulse" />
                  ))}
                </div>
              }
            >
              <SearchResults searchParams={{ q: "" }} />
            </Suspense>
          </div>
        </main>
      </div>
    </AuthCheckClient>
  );
}

