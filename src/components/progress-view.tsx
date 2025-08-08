'use client';

import { useEffect, useState } from 'react';
import type { InterviewSession, Question } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export function ProgressView() {
  const [completedSessions, setCompletedSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    const allSessions: InterviewSession[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
    const completed = allSessions
        .filter(s => s.status === 'completed')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setCompletedSessions(completed);
  }, []);

  const chartData = completedSessions.map(session => {
    const totalScore = session.questions.reduce((acc, q) => acc + (q.feedback?.score || 0), 0);
    const avgScore = session.questions.length > 0 ? totalScore / session.questions.length : 0;
    return {
      name: format(new Date(session.createdAt), 'MMM d'),
      'Average Score': parseFloat(avgScore.toFixed(2)),
      jobRole: session.jobRole,
    };
  }).reverse();

  if (completedSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
        <h2 className="text-2xl font-headline font-semibold">No Completed Interviews Yet</h2>
        <p className="text-muted-foreground mt-2 mb-4">Complete an interview to see your progress here.</p>
        <Button asChild>
          <Link href="/interview">Start Your First Interview</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Performance Over Time</CardTitle>
          <CardDescription>Your average interview scores across all completed sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]}/>
                <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                <Legend />
                <Bar dataKey="Average Score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-headline font-semibold">Interview History</h2>
        <Accordion type="single" collapsible className="w-full">
            {completedSessions.map(session => (
                <AccordionItem key={session.id} value={session.id}>
                    <AccordionTrigger>
                        <div className="flex justify-between items-center w-full pr-4">
                            <div className="text-left">
                                <p className="font-semibold text-primary">{session.jobRole}</p>
                                <p className="text-sm text-muted-foreground">{format(new Date(session.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
                            </div>
                             <Badge>
                                 Avg. {
                                     (session.questions.reduce((acc, q) => acc + (q.feedback?.score || 0), 0) / session.questions.length).toFixed(0)
                                 }%
                             </Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-4 bg-secondary/50 rounded-md">
                            {session.questions.map((q, index) => (
                                <Card key={q.id}>
                                    <CardHeader>
                                        <CardTitle className="text-base">Q{index + 1}: {q.text}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="italic text-muted-foreground">Your answer: "{q.answer}"</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Badge variant="secondary">Score: {q.feedback?.score || 'N/A'}</Badge>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
