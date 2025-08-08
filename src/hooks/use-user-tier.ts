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
    const { user } = useAuth();
    const [userTier, setUserTier] = useState<UserTier>('free');
    const [hasReachedLimit, setHasReachedLimit] = useState(false);

    useEffect(() => {
        const tier = user ? 'premium' : 'free';
        setUserTier(tier);
    }, [user]);

    const getTodayDateString = () => {
        return new Date().toISOString().split('T')[0];
    }
    
    const checkInterviewLimit = useCallback(() => {
        // Only check limit for free tier (guests)
        if (userTier === 'premium') {
            setHasReachedLimit(false);
            return;
        }

        try {
            const sessions: InterviewSession[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
            const today = getTodayDateString();
            
            // For free tier, we check sessions created with the 'free' userTier property
            const todaysSessions = sessions.filter(s => s.createdAt.startsWith(today) && s.userTier === 'free');

            if (todaysSessions.length >= TIER_CONFIG.free.interviewLimit) {
                setHasReachedLimit(true);
            } else {
                setHasReachedLimit(false);
            }
        } catch (error) {
            console.error("Failed to parse interview sessions from localStorage", error);
            setHasReachedLimit(false);
        }
    }, [userTier]);


    useEffect(() => {
        checkInterviewLimit();
    }, [userTier, checkInterviewLimit]);

    return {
        userTier,
        questionCount: TIER_CONFIG[userTier].questionCount,
        interviewLimit: TIER_CONFIG[userTier].interviewLimit,
        hasReachedLimit,
    };
};
