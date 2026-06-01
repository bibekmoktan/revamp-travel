'use client';

type Provider = 'google' | 'facebook' | 'apple';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

const PROVIDERS: {
  id: Provider;
  label: string;
  bg: string;
  border: string;
  textColor: string;
  icon: () => JSX.Element;
}[] = [
  {
    id: 'google',
    label: 'Continue with Google',
    bg: 'bg-white hover:bg-gray-50',
    border: 'border border-gray-300',
    textColor: 'text-gray-700',
    icon: GoogleIcon,
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    bg: 'bg-[#1877F2] hover:bg-[#166FE5]',
    border: 'border border-[#1877F2]',
    textColor: 'text-white',
    icon: FacebookIcon,
  },
  {
    id: 'apple',
    label: 'Continue with Apple',
    bg: 'bg-black hover:bg-gray-900',
    border: 'border border-black',
    textColor: 'text-white',
    icon: AppleIcon,
  },
];

function getOAuthUrl(provider: Provider): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const redirectUri = `${origin}/auth/callback`;

  if (provider === 'google') {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
    return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id:    clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope:        'openid email profile',
      state:        'google',
      access_type:  'offline',
      prompt:       'select_account',
    })}`;
  }

  if (provider === 'facebook') {
    const clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID ?? '';
    return `https://www.facebook.com/v19.0/dialog/oauth?${new URLSearchParams({
      client_id:     clientId,
      redirect_uri:  redirectUri,
      scope:         'email',
      state:         'facebook',
      response_type: 'code',
    })}`;
  }

  // Apple — uses fragment mode so the id_token comes back in the URL hash
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? '';
  return `https://appleid.apple.com/auth/authorize?${new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: 'code id_token',
    scope:         'name email',
    response_mode: 'fragment',
    state:         'apple',
  })}`;
}

export default function OAuthButtons() {
  function handleClick(provider: Provider) {
    window.location.href = getOAuthUrl(provider);
  }

  return (
    <div className="space-y-3">
      {PROVIDERS.map(({ id, label, bg, border, textColor, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleClick(id)}
          className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${bg} ${border} ${textColor}`}
        >
          <Icon />
          {label}
        </button>
      ))}
    </div>
  );
}
