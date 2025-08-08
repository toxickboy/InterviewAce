'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Crown, Star, Loader2 } from "lucide-react";
import { useUserTier } from "@/hooks/use-user-tier";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createCashfreeOrder } from "@/lib/actions";

declare const window: any;

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
        price: "₹830",
        priceInPaise: 83000,
        amountInRupees: 830,
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
    const { userTier } = useUserTier();
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpgrade = async () => {
        if (!user) {
            router.push('/login?redirect=/pricing');
            return;
        }

        setIsProcessing(true);

        if (typeof window.Cashfree === 'undefined') {
            toast({
                variant: 'destructive',
                title: 'Initialization Error',
                description: "Payment gateway is not available. Please refresh and try again.",
            });
            setIsProcessing(false);
            return;
        }

        try {
            const order = await createCashfreeOrder({
                amount: tiers[1].amountInRupees,
                userId: user.uid,
                userEmail: user.email || 'test@example.com',
                userName: user.displayName || 'Test User'
            });

            if (order.payment_session_id) {
                const cashfree = new window.Cashfree(order.payment_session_id);
                cashfree.checkout({
                    paymentStyle: "popup",
                });
            } else {
                throw new Error("Failed to create payment session.");
            }

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || "Something went wrong during payment setup.",
            });
        } finally {
            // Cashfree's popup will handle the UI flow, so we don't want to immediately set isProcessing to false
            // unless there's an error. We can listen for popup close events if we want to be more precise.
            // For now, we let the user re-attempt if the popup doesn't open.
            setTimeout(() => setIsProcessing(false), 3000); // Re-enable button after 3s
        }
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
                    <div className="p-6">
                        {userTier === 'premium' ? (
                            <Button className="w-full" disabled variant="outline">Your Current Plan</Button>
                        ) : (
                             <Button onClick={handleUpgrade} disabled={isProcessing} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Crown className="mr-2 h-4 w-4"/>}
                                Upgrade to Premium
                            </Button>
                        )}
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                            By upgrading, you agree to a recurring monthly subscription. You can cancel anytime.
                        </p>
                    </div>
                </Card>
            </div>
             <div className="text-center mt-8 text-sm text-muted-foreground">
                <p>Payments are processed securely by Cashfree. All prices in INR are final.</p>
            </div>
        </div>
    );
}
