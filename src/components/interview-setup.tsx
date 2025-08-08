'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateQuestionsAction, generateResumeQuestionsAction } from '@/lib/actions';
import type { InterviewSession, Question, QuestionType } from '@/lib/types';
import { Loader2, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const formSchema = z.object({
  jobRole: z.string().min(2, { message: 'Job role must be at least 2 characters.' }).max(100),
  resumeText: z.string().optional(),
  interviewType: z.enum(['full', 'hr', 'technical', 'behavioral', 'aptitude']),
});

export function InterviewSetup() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRole: '',
      resumeText: '',
      interviewType: 'full',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      let allQuestions: Omit<Question, 'feedback' | 'answer'>[] = [];

      // Generate standard questions
      const standardQuestionsData = await generateQuestionsAction({ jobRole: values.jobRole });
      
      const questionMapping: Record<QuestionType, string[]> = {
        hr: standardQuestionsData.hrQuestions,
        technical: standardQuestionsData.technicalQuestions,
        behavioral: standardQuestionsData.behavioralQuestions,
        aptitude: standardQuestionsData.aptitudeQuestions,
        resume: [], // Resume questions are handled separately
      };

      if (values.interviewType === 'full') {
        allQuestions.push(...standardQuestionsData.hrQuestions.map(q => ({ id: uuidv4(), type: 'hr' as const, text: q })));
        allQuestions.push(...standardQuestionsData.technicalQuestions.map(q => ({ id: uuidv4(), type: 'technical' as const, text: q })));
        allQuestions.push(...standardQuestionsData.behavioralQuestions.map(q => ({ id: uuidv4(), type: 'behavioral' as const, text: q })));
        allQuestions.push(...standardQuestionsData.aptitudeQuestions.map(q => ({ id: uuidv4(), type: 'aptitude' as const, text: q })));
      } else {
        const selectedQuestions = questionMapping[values.interviewType as Exclude<QuestionType, 'resume'>];
        allQuestions.push(...selectedQuestions.map(q => ({ id: uuidv4(), type: values.interviewType as QuestionType, text: q })));
      }

      // Generate resume-based questions if resume is provided
      if (values.resumeText && values.resumeText.trim().length > 0) {
        const resumeQuestionsData = await generateResumeQuestionsAction({ resumeText: values.resumeText });
        allQuestions.unshift(...resumeQuestionsData.questions.map(q => ({ id: uuidv4(), type: 'resume' as const, text: q })));
      }
      
      if (allQuestions.length === 0) {
        toast({
            variant: "destructive",
            title: "Failed to generate questions",
            description: "The AI couldn't generate questions for the given role and type. Please try a different combination.",
        });
        setIsGenerating(false);
        return;
      }

      // Create and store the session
      const newSession: InterviewSession = {
        id: uuidv4(),
        jobRole: values.jobRole,
        interviewType: values.interviewType,
        resumeText: values.resumeText,
        questions: allQuestions.map(q => ({ ...q })),
        currentQuestionIndex: 0,
        createdAt: new Date().toISOString(),
        status: 'in-progress',
      };

      const sessions = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an interview round type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="full">Full Interview (All Rounds)</SelectItem>
                            <SelectItem value="hr">HR Round</SelectItem>
                            <SelectItem value="technical">Technical / DSA Round</SelectItem>
                            <SelectItem value="behavioral">Behavioral Round</SelectItem>
                            <SelectItem value="aptitude">Aptitude Round</SelectItem>
                        </SelectContent>
                    </Select>
                  <FormDescription>Choose the type of interview you want to practice.</FormDescription>
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
                  <FormDescription>Pasting your resume will generate more specific questions based on your experience.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isGenerating} className="w-full">
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
