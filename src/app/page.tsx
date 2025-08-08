'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, History, Crown, CheckCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/hooks/use-auth';
import { useUserTier } from '@/hooks/use-user-tier';
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const tiers = [
    {
        name: "Free",
        price: "$0",
        priceDescription: "per month",
        features: [
            "1 Interview per day",
            "5 Questions per round",
            "HR, Technical, Behavioral, Aptitude rounds",
            "Basic feedback",
        ],
        cta: "Your Current Plan",
    },
    {
        name: "Premium",
        price: "₹830",
        priceDescription: "per month",
        features: [
            "10 Interviews per day",
            "20 Questions per round",
            "All rounds, including Resume-based",
            "Advanced STAR method feedback",
            "Unlimited access to all features",
        ],
        cta: "Upgrade to Premium",
    },
];


export default function Home() {
  const { user } = useAuth();
  const { userTier, setTierToPremium } = useUserTier();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      setTierToPremium();
      toast({
        title: "Upgrade Successful!",
        description: "Welcome to InterviewAce Premium!",
        variant: 'default'
      });
    } else if (paymentStatus === 'failed' || paymentStatus === 'error') {
       toast({
        title: "Payment Failed",
        description: "Your payment could not be processed. Please try again.",
        variant: 'destructive'
      });
    }
  }, [searchParams, setTierToPremium, toast]);


  return (
    <div className="container mx-auto animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Welcome to InterviewAce
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personal AI-powered mock interviewer. Practice with tailored questions, get instant feedback, and track your progress to land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/interview">
                <PlusCircle className="mr-2 h-5 w-5" />
                Start New Interview
              </Link>
            </Button>
            {user && userTier === 'free' && (
                 <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/pricing">
                    <Crown className="mr-2 h-5 w-5" />
                    Upgrade to Premium
                  </Link>
                </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <Link href="/progress">
                <History className="mr-2 h-5 w-5" />
                View Progress
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="https://placehold.co/500x500.png"
            alt="AI Interviewer illustration"
            data-ai-hint="robot interview"
            width={450}
            height={450}
            className="rounded-full shadow-2xl border-8 border-card"
          />
        </div>
      </div>

      <div className="mt-16 mb-8">
        <h2 className="text-3xl font-headline font-semibold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline">1. Setup Your Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Choose a job role and optionally paste your resume for a customized interview experience.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline">2. Answer Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Engage with our AI interviewer. Answer questions via text or voice, just like in a real interview.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline">3. Get Instant Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Receive a detailed analysis of your answers, including a score, grammar check, and keyword suggestions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
       <div className="mt-24 mb-16">
        <h2 className="text-3xl font-headline font-semibold text-center mb-4">Features &amp; Plans</h2>
        <p className="text-lg text-muted-foreground text-center mb-10">Choose the plan that's right for you.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <Card className={`flex flex-col border-2 ${userTier === 'free' ? 'border-primary' : ''}`}>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Free</CardTitle>
                        <CardDescription>
                            <span className="text-3xl font-bold">$0</span>
                            <span className="text-muted-foreground">/month</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <ul className="space-y-2">
                            {tiers[0].features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                     <CardContent>
                        <Button className="w-full" disabled={userTier === 'free'} variant={userTier === 'free' ? 'outline' : 'default'}>
                            {userTier === 'free' ? 'Your Current Plan' : 'Get Started'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className={`relative flex flex-col border-2 ${userTier === 'premium' ? 'border-accent' : ''}`}>
                    <div className="absolute top-0 right-4 -mt-4">
                        <div className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                            <Star className="h-4 w-4" />
                            Most Popular
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Premium</CardTitle>
                        <CardDescription>
                            <span className="text-3xl font-bold">₹830</span>
                            <span className="text-muted-foreground">/month</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <ul className="space-y-2">
                            {tiers[1].features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardContent>
                         <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                           <Link href="/pricing">
                            <Crown className="mr-2 h-4 w-4"/>
                            {userTier === 'premium' ? 'Your Current Plan' : 'Upgrade to Premium'}
                           </Link>
                        </Button>
                    </CardContent>
                </Card>
        </div>
      </div>
    </div>
  );
}
