'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Crown, Star } from "lucide-react";
import { useUserTier } from "@/hooks/use-user-tier";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
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
        cta: "You're on this plan",
        isCurrent: true,
    },
    {
        name: "Premium",
        price: "$10",
        priceDescription: "per month",
        features: [
            "10 Interviews per day",
            "20 Questions per round",
            "All rounds, including Resume-based",
            "Advanced STAR method feedback",
            "Unlimited access to all features",
        ],
        cta: "Get Started",
        isCurrent: false,
    },
];

export default function PricingPage() {
    const { userTier, setTierToPremium } = useUserTier();
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleUpgrade = () => {
        if (!user) {
            router.push('/login?redirect=/pricing');
            return;
        }

        // Simulate payment processing
        console.log("Simulating payment for user:", user.uid);
        
        // Update user tier
        setTierToPremium();
        
        toast({
            title: "Upgrade Successful!",
            description: "Welcome to InterviewAce Premium!",
        });
        
        router.push('/');
    }

    return (
        <div className="container mx-auto max-w-4xl py-12 animate-in fade-in duration-500">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline font-bold">Choose Your Plan</h1>
                <p className="text-lg text-muted-foreground mt-2">Unlock your full potential with the right plan for you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className={`flex flex-col ${userTier === 'free' ? 'border-primary border-2' : ''}`}>
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
                    <div className="p-6">
                        <Button className="w-full" disabled={userTier === 'free'} variant={userTier === 'free' ? 'default' : 'outline'}>
                            Your Current Plan
                        </Button>
                    </div>
                </Card>

                <Card className={`relative flex flex-col ${userTier === 'premium' ? 'border-accent border-2' : ''}`}>
                    <div className="absolute top-0 right-4 -mt-4">
                        <div className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                            <Star className="h-4 w-4" />
                            Most Popular
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Premium</CardTitle>
                        <CardDescription>
                            <span className="text-3xl font-bold">$10</span>
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
                    <div className="p-6">
                        {userTier === 'premium' ? (
                            <Button className="w-full" disabled variant="outline">Your Current Plan</Button>
                        ) : (
                             <Button onClick={handleUpgrade} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                <Crown className="mr-2 h-4 w-4"/> Upgrade to Premium
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
