'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "interviewace-94uur",
  "appId": "1:733156479674:web:5f51cc712b7d27558ca883",
  "storageBucket": "interviewace-94uur.firebasestorage.app",
  "apiKey": "AIzaSyACv3I5FfWihwMPwE-cL3OXL5tzxoHTwW4",
  "authDomain": "interviewace-94uur.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "733156479674"
};


// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

export { app, auth };
