import {useEffect, useState} from 'react';
import {
  AuthSession,
  getSession,
  onAuthStateChange,
} from '../Services/AuthServices';

export const useAuth = () => {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    getSession().then(
      ({
        data: {session: newSession},
      }: {
        data: {session: AuthSession | null};
      }) => {
        setSession(newSession);
      },
    );

    onAuthStateChange((_event, newSession: AuthSession | null) => {
      setSession(newSession);
    });
  }, []);

  return session;
};
