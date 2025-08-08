'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateQuestionsAction, generateResumeQuestionsAction } from '@/lib/actions';
import type { InterviewSession, Question, QuestionType, UserTier } from '@/lib/types';
import { Loader2, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useUserTier } from '@/hooks/use-user-tier';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Crown } from 'lucide-react';

const formSchema = z.object({
  jobRole: z.string().min(2, { message: 'Job role must be at least 2 characters.' }).max(100),
  resumeText: z.string().optional(),
  interviewType: z.enum(['full', 'hr', 'technical', 'behavioral', 'aptitude', 'resume']),
});

export function InterviewSetup() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const { userTier, questionCount, interviewLimit, hasReachedLimit } = useUserTier();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRole: '',
      resumeText: '',
      interviewType: 'technical',
    },
  });

  const { watch } = form;
  const resumeText = watch('resumeText');
  
  useEffect(() => {
    if (userTier === 'free') {
        form.setValue('interviewType', 'technical');
    } else {
        form.setValue('interviewType', 'full');
    }
  }, [userTier, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (hasReachedLimit) {
        toast({
            variant: "destructive",
            title: "Interview Limit Reached",
            description: `As a ${userTier} user, you can only start ${interviewLimit} interview(s) per day.`,
        });
        return;
    }

    setIsGenerating(true);
    try {
      let allQuestions: Omit<Question, 'feedback' | 'answer'>[] = [];

      const standardQuestionsData = await generateQuestionsAction({ 
        jobRole: values.jobRole,
        questionCount: questionCount 
      });
      
      const questionMapping: Record<QuestionType, string[]> = {
        hr: standardQuestionsData.hrQuestions,
        technical: standardQuestionsData.technicalQuestions,
        behavioral: standardQuestionsData.behavioralQuestions,
        aptitude: standardQuestionsData.aptitudeQuestions,
        resume: [], 
      };

      if (values.interviewType === 'full') {
        allQuestions.push(...standardQuestionsData.hrQuestions.map(q => ({ id: uuidv4(), type: 'hr' as const, text: q })));
        allQuestions.push(...standardQuestionsData.technicalQuestions.map(q => ({ id: uuidv4(), type: 'technical' as const, text: q })));
        allQuestions.push(...standardQuestionsData.behavioralQuestions.map(q => ({ id: uuidv4(), type: 'behavioral' as const, text: q })));
        allQuestions.push(...standardQuestionsData.aptitudeQuestions.map(q => ({ id: uuidv4(), type: 'aptitude' as const, text: q })));
      } else if (values.interviewType !== 'resume') {
        const selectedQuestions = questionMapping[values.interviewType as Exclude<QuestionType, 'resume'>];
        allQuestions.push(...selectedQuestions.map(q => ({ id: uuidv4(), type: values.interviewType as QuestionType, text: q })));
      }
      
      if (values.resumeText && values.resumeText.trim().length > 0) {
        const resumeQuestionsData = await generateResumeQuestionsAction({ 
            resumeText: values.resumeText,
            questionCount: questionCount
        });
        const resumeQuestions = resumeQuestionsData.questions.map(q => ({ id: uuidv4(), type: 'resume' as const, text: q }));
        if (values.interviewType === 'resume' || values.interviewType === 'full') {
            allQuestions.unshift(...resumeQuestions);
        }
      }
      
      if (allQuestions.length === 0) {
        toast({
            variant: "destructive",
            title: "Failed to generate questions",
            description: "The AI couldn't generate questions for the given role. Please try a different combination.",
        });
        setIsGenerating(false);
        return;
      }
      
      const newSession: InterviewSession = {
        id: uuidv4(),
        jobRole: values.jobRole,
        interviewType: values.interviewType,
        resumeText: values.resumeText,
        questions: allQuestions.map(q => ({ ...q })),
        currentQuestionIndex: 0,
        createdAt: new Date().toISOString(),
        status: 'in-progress',
        userTier: userTier,
      };

      const sessions = JSON.parse(localStorage.getItem('interview_sessions') || '[]') as InterviewSession[];
      sessions.push(newSession);
      localStorage.setItem('interview_sessions', JSON.stringify(sessions));

      router.push(`/interview/${newSession.id}`);
    } catch (error) {
      console.error('Failed to start interview:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
      });
      setIsGenerating(false);
    }
  }

  return (
    <Card className="w-full animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Your Mock Interview</CardTitle>
        <CardDescription>Fill in the details below to start your personalized interview session.</CardDescription>
      </CardHeader>
      <CardContent>
        {userTier === 'premium' && (
             <Alert className="mb-6 border-accent bg-accent/10 text-accent-foreground">
                <Crown className="h-4 w-4" />
                <AlertTitle className="font-bold">Premium Tier</AlertTitle>
                <AlertDescription>
                    You have access to {interviewLimit} interviews per day with {questionCount} questions per round.
                </AlertDescription>
            </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="jobRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer, Product Manager" {...field} />
                  </FormControl>
                  <FormDescription>The role you are interviewing for.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interviewType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Round</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isGenerating || userTier === 'free'}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an interview round type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                             {userTier === 'premium' && <SelectItem value="full">Full Interview (All Rounds)</SelectItem>}
                            <SelectItem value="hr">HR Round</SelectItem>
                            <SelectItem value="technical">Technical / DSA Round</SelectItem>
                            <SelectItem value="behavioral">Behavioral Round</SelectItem>
                            <SelectItem value="aptitude">Aptitude Round</SelectItem>
                            {userTier === 'premium' && (
                                <SelectItem value="resume" disabled={!resumeText?.trim()}>Resume-based Round</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                  <FormDescription>
                      {userTier === 'free' ? 'As a free user, you are limited to one round per interview.' : 'Choose the type of interview you want to practice.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resumeText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Resume (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your resume here to get tailored questions..."
                      className="min-h-[200px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                      {userTier === 'premium' ? 
                      'Pasting your resume will add resume-based questions to the selected round.' :
                      'Upgrade to premium to unlock resume-based questions.'
                      }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isGenerating || hasReachedLimit} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Your Interview...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Interview
                </>
              )}
            </Button>
            {hasReachedLimit && (
                <p className="text-sm text-destructive text-center">You have reached your daily interview limit.</p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
