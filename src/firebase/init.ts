'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

// This function centralizes Firebase initialization.
// It ensures that Firebase is initialized only once, whether on the server or client.
export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
} {
  // If apps are already initialized, return the existing instances.
  // This prevents re-initialization errors, especially in Next.js's hot-reloading environment.
  if (getApps().length) {
    const app = getApp();
    return {
      firebaseApp: app,
      auth: getAuth(app),
      firestore: getFirestore(app),
      storage: getStorage(app),
    };
  }

  // If no app is initialized, create a new one.
  const firebaseApp = initializeApp(firebaseConfig);

  // Return the newly created service instances.
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp),
  };
}
