'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithProvider } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    async function handle() {
      try {
        const origin = window.location.origin;
        const redirectUri = `${origin}/auth/callback`;

        // Apple uses fragment mode — params are in window.location.hash
        const hash = window.location.hash.slice(1); // strip leading #
        if (hash) {
          const hashParams = new URLSearchParams(hash);
          const state = hashParams.get('state');
          if (state === 'apple') {
            const idToken = hashParams.get('id_token');
            const appleError = hashParams.get('error');
            if (appleError) throw new Error(`Apple Sign In failed: ${appleError}`);
            if (!idToken) throw new Error('Apple Sign In did not return an ID token');
            await loginWithProvider('apple', '', redirectUri, idToken);
            router.replace('/');
            return;
          }
        }

        // Google / Facebook — params are in query string
        const code     = searchParams.get('code');
        const state    = searchParams.get('state');
        const oauthErr = searchParams.get('error');

        if (oauthErr) throw new Error(`OAuth failed: ${oauthErr}`);
        if (!code || !state) throw new Error('Missing OAuth parameters');

        if (state !== 'google' && state !== 'facebook') {
          throw new Error('Unknown OAuth provider');
        }

        await loginWithProvider(state, code, redirectUri);
        router.replace('/');
      } catch (err: any) {
        setError(err.message ?? 'Sign in failed. Please try again.');
      }
    }

    handle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => router.replace('/login')}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-600 text-sm">Signing you in…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
