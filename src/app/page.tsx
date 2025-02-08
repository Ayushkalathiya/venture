"use client";

import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Search, TrendingUp, Users, Waves, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#fdfcfb] via-[#e8eef1] to-[#dfe9f3] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-foreground transition-all">
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
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <GoogleSignInButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative py-32 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-primary/[0.02] -z-10" />
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Startup Matching
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-primary via-blue-600 to-violet-600 dark:from-primary dark:via-blue-400 dark:to-violet-400 text-transparent bg-clip-text">
              Connect. Collaborate.
              <br /> Conquer.
            </h2>
            <p className="mt-6 text-lg md:text-2xl text-muted-foreground">
              Empowering visionary startups to scale with the right partners.
              <br /> Join the wave and ride to success.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 hover:shadow-primary/50"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Link href="/home" className="flex items-center gap-2">
                  Dive In Now 
                  <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Link>
                <div className="absolute inset-0 rounded-full bg-primary/20 blur animate-pulse -z-10" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 rounded-full hover:bg-primary/10 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5" />
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Why Choose Us
              </div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-600 to-violet-600 dark:from-primary dark:via-blue-400 dark:to-violet-400 text-transparent bg-clip-text">
                Why Choose VentureWave
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Unlock the power of innovation with our unique features.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Search />}
                title="AI-Powered Matching"
                description="Find investors who align perfectly with your vision using our intelligent matching system."
              />
              <FeatureCard
                icon={<Users />}
                title="Global Network"
                description="Connect with a worldwide community of mentors, investors, and industry leaders."
              />
              <FeatureCard
                icon={<TrendingUp />}
                title="Growth Acceleration"
                description="Leverage our tools to fast-track your startup's success."
              />
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-primary/10 blur-3xl -z-10 animate-pulse" />
          
          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="rounded-2xl border border-primary/20 bg-background/60 backdrop-blur-sm p-8 md:p-12 shadow-xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Limited Time Offer
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Ready to Transform Your Startup Journey?
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Join thousands of successful founders who have already discovered the power of AI-driven matching and mentorship.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg"
                      className="group relative bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full shadow-lg transition-all duration-300 hover:shadow-primary/25"
                    >
                      <Link href="/home" className="flex items-center gap-2">
                        Get Started Free
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline"
                      size="lg"
                      className="rounded-full hover:bg-primary/10 transition-all duration-300"
                    >
                      View Success Stories
                    </Button>
                  </div>
                </div>

                {/* Right Stats */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 p-6 rounded-xl bg-primary/5 border border-primary/10">
                    <h4 className="text-4xl font-bold text-primary">500+</h4>
                    <p className="text-sm text-muted-foreground">Successful Matches</p>
                  </div>
                  <div className="space-y-2 p-6 rounded-xl bg-primary/5 border border-primary/10">
                    <h4 className="text-4xl font-bold text-primary">95%</h4>
                    <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                  </div>
                  <div className="space-y-2 p-6 rounded-xl bg-primary/5 border border-primary/10">
                    <h4 className="text-4xl font-bold text-primary">50M+</h4>
                    <p className="text-sm text-muted-foreground">Capital Raised</p>
                  </div>
                  <div className="space-y-2 p-6 rounded-xl bg-primary/5 border border-primary/10">
                    <h4 className="text-4xl font-bold text-primary">30+</h4>
                    <p className="text-sm text-muted-foreground">Countries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="group relative bg-background/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl border border-primary/10">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl" />
      <CardHeader>
        <CardTitle className="flex flex-col items-center text-center">
          <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <span className="mt-4 text-xl font-semibold">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
