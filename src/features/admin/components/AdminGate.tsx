import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, LogIn, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, signInWithGoogle, signOut, getAdminUserByEmail, recordAdminLogin } from '@/lib/supabase';

type GateStatus = 'loading' | 'unauthenticated' | 'forbidden' | 'ready';

export function AdminGate({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [status, setStatus] = useState<GateStatus>('loading');

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      setStatus('unauthenticated');
      return;
    }

    const provider = session.user.app_metadata?.provider;
    if (provider && provider !== 'google') {
      await signOut();
      toast.error('Google sign-in is required for admin access.');
      setStatus('unauthenticated');
      return;
    }

    const admin = await getAdminUserByEmail(session.user.email || '');
    if (!admin) {
      await signOut();
      setStatus('forbidden');
      return;
    }

    setStatus('ready');
    await recordAdminLogin(session.user);
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await checkAccess();
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (!mounted) return;
      checkAccess();
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    const redirectTo = `${window.location.origin}${location.pathname}`;
    await signInWithGoogle(redirectTo);
  };

  if (status === 'ready') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-6 sm:p-8 w-full max-w-md border border-white/10">
        {status === 'loading' && (
          <div className="flex items-center gap-3 text-white/60">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Checking admin access...</span>
          </div>
        )}

        {status === 'unauthenticated' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white text-lg font-semibold">Admin Sign In</h2>
                <p className="text-white/40 text-sm">Google sign-in required</p>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Continue with Google
            </button>
          </div>
        )}

        {status === 'forbidden' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-white text-lg font-semibold">Access Denied</h2>
                <p className="text-white/40 text-sm">
                  Your email is not on the admin allowlist.
                </p>
              </div>
            </div>

            <p className="text-white/30 text-sm">
              If you believe this is a mistake, ask the site owner to add your email to the
              Supabase admin list.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
