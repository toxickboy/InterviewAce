# InterviewAce - AI-Powered Mock Interview Platform

InterviewAce is a Next.js application built with Firebase Studio to help users practice for job interviews. It leverages AI to generate tailored interview questions, analyze user responses, and provide detailed feedback to help candidates improve. The platform supports different interview types (HR, technical, behavioral, etc.) and allows for resume-based question generation for a personalized experience.

This project was built in Firebase Studio.

## ✨ Features

- **Personalized Interview Sessions:** Generate unique interview sessions based on a specific job role.
- **Multiple Interview Rounds:** Practice questions for HR, Technical, Behavioral, and Aptitude rounds.
- **AI-Powered Feedback:** Receive instant, detailed feedback on your answers, including a score, analysis based on the STAR method, grammar checks, and keyword suggestions.
- **Performance Tracking:** Review your progress over time with a history of completed interviews and visualized performance data.
- **User Authentication:** Secure sign-up and login with email/password or Google.
- **Free & Premium Tiers:** A tiered system offering basic features for free and advanced capabilities (like resume analysis and higher limits) via a monthly subscription with Razorpay integration.
- **Responsive Design:** A modern, fully responsive UI built with Next.js, ShadCN, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **AI/Generative:** [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google Gemini
- **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/hosting)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Payments:** [Razorpay](https://razorpay.com/)

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

### Local Configuration

1.  Create a `.env` file in the root of your project. This file is for **local development only** and should **not** be committed to Git.
2.  Add your local development keys to the `.env` file:
    ```.env
    # For Google Generative AI
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

    # For Razorpay (Test Mode)
    RAZORPAY_KEY_ID="YOUR_RAZORPAY_TEST_KEY_ID"
    RAZORPAY_KEY_SECRET="YOUR_RAZORPAY_TEST_KEY_SECRET"
    NEXT_PUBLIC_RAZORPAY_KEY_ID="YOUR_RAZORPAY_TEST_KEY_ID"
    ```
3.  Ensure your `src/lib/firebase.ts` file is configured with your Firebase project details.

### Running the Development Server

To run the app in development mode, use the following command:

```sh
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 🚀 Deployment

This application is configured for deployment using **Firebase App Hosting**.

### 1. Set Up Secrets in Google Cloud

Your production API keys must be stored securely in Google Cloud Secret Manager. **Do not commit your `.env` file with production keys.**

- Go to the [Secret Manager](https://console.cloud.google.com/security/secret-manager) in your Google Cloud console.
- Create secrets for `GEMINI_API_KEY`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET`.
- Grant the **Secret Manager Secret Accessor** role to your App Hosting service account (`service-<PROJECT_NUMBER>@gcp-sa-apphosting.iam.gserviceaccount.com`).

The `apphosting.yaml` file is already configured to use these secrets.

### 2. Deploy Manually

To deploy your application for the first time or for manual updates, use the Firebase CLI:

```sh
# Login to Firebase
firebase login

# Initialize App Hosting (only once per project)
firebase init apphosting

# Deploy the backend
firebase apphosting:backends:deploy
```

### 3. Automated Deployment with GitHub

For continuous deployment, connect your GitHub repository to Firebase App Hosting:

1.  Push your project to a GitHub repository.
2.  In the Firebase console, navigate to **App Hosting**.
3.  Follow the prompts to connect your GitHub repository.
4.  Configure the deployment to trigger from your main branch.

Now, every `git push` to your main branch will automatically build and deploy a new version of your application.
