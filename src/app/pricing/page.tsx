'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Crown, Star, Loader2 } from "lucide-react";
import { useUserTier } from "@/hooks/use-user-tier";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createRazorpayOrder } from "@/lib/actions";

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
        price: "₹830", // Approx $10
        priceInPaise: 83000,
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
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpgrade = async () => {
        if (!user) {
            router.push('/login?redirect=/pricing');
            return;
        }

        setIsProcessing(true);

        try {
            const order = await createRazorpayOrder(830); // 830 INR for premium
            
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "InterviewAce Premium",
                description: "Monthly Subscription",
                order_id: order.id,
                handler: function (response: any) {
                    // Here you would verify the payment signature on your backend
                    // For now, we'll assume it's successful
                    console.log("Payment successful:", response);
                    setTierToPremium();
                    toast({
                        title: "Upgrade Successful!",
                        description: "Welcome to InterviewAce Premium!",
                    });
                    router.push('/');
                },
                prefill: {
                    name: user.displayName || "User",
                    email: user.email,
                },
                theme: {
                    color: "#5C6BC0" // Corresponds to --primary color
                }
            };
            
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any){
                toast({
                    variant: 'destructive',
                    title: 'Payment Failed',
                    description: response.error.description,
                });
            });
            rzp.open();

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || "Something went wrong during payment setup.",
            });
        } finally {
            setIsProcessing(false);
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
                <p>Payments are processed securely by Razorpay. All prices in INR are final.</p>
            </div>
        </div>
    );
}
