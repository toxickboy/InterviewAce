'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserTier, InterviewSession } from '@/lib/types';
import { useAuth } from './use-auth';

const TIER_CONFIG = {
    free: {
        interviewLimit: 1,
        questionCount: 5,
    },
    premium: {
        interviewLimit: 10,
        questionCount: 20,
    }
}

export const useUserTier = () => {
    const { user, loading } = useAuth();
    const [userTier, setUserTier] = useState<UserTier>('free');
    const [hasReachedLimit, setHasReachedLimit] = useState(false);

    useEffect(() => {
        if (loading) return; 

        let tier: UserTier = 'free';
        if (user) {
            const storedTier = localStorage.getItem(`user_tier_${user.uid}`);
            if (storedTier === 'premium') {
                tier = 'premium';
            }
        }
        setUserTier(tier);
    }, [user, loading]);

    const getTodayDateString = () => {
        return new Date().toISOString().split('T')[0];
    }
    
    const checkInterviewLimit = useCallback(() => {
        if (userTier === 'premium') {
            setHasReachedLimit(false);
            return;
        }

        try {
            const sessions: InterviewSession[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
            const today = getTodayDateString();
            
            let todaysSessionCount = 0;
            if (user) {
                 // Logged-in free user: check against their UID
                todaysSessionCount = sessions.filter(s => s.createdAt.startsWith(today) && s.userId === user.uid).length;
            } else {
                 // Guest user: check against 'guest' user id
                todaysSessionCount = sessions.filter(s => s.createdAt.startsWith(today) && s.userId === 'guest').length;
            }

            if (todaysSessionCount >= TIER_CONFIG.free.interviewLimit) {
                setHasReachedLimit(true);
            } else {
                setHasReachedLimit(false);
            }
        } catch (error) {
            console.error("Failed to parse interview sessions from localStorage", error);
            setHasReachedLimit(false);
        }
    }, [userTier, user]);

    useEffect(() => {
        checkInterviewLimit();
    }, [userTier, checkInterviewLimit]);

    const setTierToPremium = () => {
        if (user) {
            localStorage.setItem(`user_tier_${user.uid}`, 'premium');
            setUserTier('premium');
        }
    }

    return {
        userTier,
        questionCount: TIER_CONFIG[userTier].questionCount,
        interviewLimit: TIER_CONFIG[userTier].interviewLimit,
        hasReachedLimit,
        setTierToPremium,
    };
};
