'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  type Query,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore';

type UseCollectionResult<T> = {
  data: (T & { id: string })[] | null;
  loading: boolean;
  error: Error | null;
};

export function useCollection<T extends DocumentData>(
  query: Query<T> | null
): UseCollectionResult<T> {
  const [data, setData] = useState<(T & { id: string })[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const result: (T & { id: string })[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() });
        });
        setData(result);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error in useCollection:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return { data, loading, error };
}
