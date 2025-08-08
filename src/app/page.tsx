import { UserTierSwitcher } from "@/components/user-tier-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Welcome to InterviewAce
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personal AI-powered mock interviewer. Practice with tailored questions, get instant feedback, and track your progress to land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/interview">
                <PlusCircle className="mr-2 h-5 w-5" />
                Start New Interview
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/progress">
                <History className="mr-2 h-5 w-5" />
                View Progress
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="https://placehold.co/500x500.png"
            alt="AI Interviewer illustration"
            data-ai-hint="robot interview"
            width={450}
            height={450}
            className="rounded-full shadow-2xl border-8 border-card"
          />
        </div>
      </div>

      <div className="my-8">
        <UserTierSwitcher />
      </div>

      <div className="mt-16 mb-8">
        <h2 className="text-3xl font-headline font-semibold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline">1. Setup Your Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Choose a job role and optionally paste your resume for a customized interview experience.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline">2. Answer Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Engage with our AI interviewer. Answer questions via text or voice, just like in a real interview.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline">3. Get Instant Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Receive a detailed analysis of your answers, including a score, grammar check, and keyword suggestions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
