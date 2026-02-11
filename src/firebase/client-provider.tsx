'use client';

import { type ReactNode } from 'react';
import { FirebaseProvider, type FirebaseContextState } from './provider';

export function FirebaseClientProvider({
  children,
  ...props
}: {
  children: ReactNode;
} & FirebaseContextState) {
  return <FirebaseProvider {...props}>{children}</FirebaseProvider>;
}
