'use client';

export * from './init';

export {
  FirebaseContext,
  FirebaseProvider,
  useFirebase,
  useAuth,
  useFirestore,
  useStorage,
  useFirebaseApp,
  useMemoFirebase,
  useUser
} from './provider';

export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export type { UseCollectionResult, WithId } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export type { UseDocResult } from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export { FirestorePermissionError } from './errors';
export type { SecurityRuleContext } from './errors';
export { errorEmitter } from './error-emitter';
