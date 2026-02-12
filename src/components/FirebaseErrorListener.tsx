'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';

// This component is a hack for development to surface security rule errors
// in the Next.js overlay. It should not be used in production.
export default function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Throwing the error here will cause it to be picked up by the Next.js error overlay.
      // This gives developers immediate, rich context about security rule failures.
      // We wrap it in a setTimeout to break out of the current call stack.
      setTimeout(() => {
        throw error;
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}
