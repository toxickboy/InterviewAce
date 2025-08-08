'use client';

import { useUserTier } from "@/hooks/use-user-tier";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Crown } from "lucide-react";

export function UserTierSwitcher() {
    const { userTier, setUserTier } = useUserTier();

    return (
        <Card>
            <CardContent className="flex flex-row items-center justify-between p-4">
                <div className="space-y-0.5">
                    <Label className="text-base font-semibold">User Tier</Label>
                    <p className="text-sm text-muted-foreground">
                        Simulate switching between free and premium user plans.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="tier-switch" className={userTier === 'free' ? 'font-bold text-primary' : ''}>Free</Label>
                    <Switch
                        id="tier-switch"
                        checked={userTier === 'premium'}
                        onCheckedChange={(checked) => setUserTier(checked ? 'premium' : 'free')}
                    />
                    <Label htmlFor="tier-switch" className={userTier === 'premium' ? 'font-bold text-primary' : ''}>Premium</Label>
                    {userTier === 'premium' && <Crown className="h-5 w-5 text-yellow-500" />}
                </div>
            </CardContent>
        </Card>
    );
}
