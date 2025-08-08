'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserTier, InterviewSession } from '@/lib/types';

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
    const [userTier, setUserTierState] = useState<UserTier>('free');
    const [hasReachedLimit, setHasReachedLimit] = useState(false);

    const getTodayDateString = () => {
        return new Date().toISOString().split('T')[0];
    }
    
    const setUserTier = (tier: UserTier) => {
        localStorage.setItem('user_tier', tier);
        setUserTierState(tier);
    }
    
    const checkInterviewLimit = useCallback((tier: UserTier) => {
        const sessions: InterviewSession[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
        const today = getTodayDateString();
        const todaysSessions = sessions.filter(s => s.createdAt.startsWith(today) && s.userTier === tier);

        if (todaysSessions.length >= TIER_CONFIG[tier].interviewLimit) {
            setHasReachedLimit(true);
        } else {
            setHasReachedLimit(false);
        }
    }, []);

    useEffect(() => {
        const storedTier = localStorage.getItem('user_tier') as UserTier | null;
        const currentTier = storedTier || 'free';
        setUserTierState(currentTier);
        checkInterviewLimit(currentTier);
    }, [checkInterviewLimit]);

    useEffect(() => {
        checkInterviewLimit(userTier);
    }, [userTier, checkInterviewLimit]);

    return {
        userTier,
        setUserTier,
        questionCount: TIER_CONFIG[userTier].questionCount,
        interviewLimit: TIER_CONFIG[userTier].interviewLimit,
        hasReachedLimit,
    };
};
