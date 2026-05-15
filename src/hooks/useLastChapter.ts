import { useEffect, useState } from 'react';

const KEY = 'gh4d:lastChapter';

export function useLastChapter(): [string | null, (slug: string) => void, () => void] {
  const [slug, setSlug] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(KEY);
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSlug(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const save = (s: string) => {
    window.localStorage.setItem(KEY, s);
    setSlug(s);
  };

  const clear = () => {
    window.localStorage.removeItem(KEY);
    setSlug(null);
  };

  return [slug, save, clear];
}
