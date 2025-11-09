// lib/deeplinks.js
import { Linking } from 'react-native';
import { useEffect } from 'react';
import { useProviders } from '../state/ProvidersStore';

export function useOAuthDeepLinks(onDone) {
  const refresh = useProviders(s => s.refresh);

  useEffect(() => {
    const handler = async (event) => {
      try {
        const url = event?.url || '';
        // expect: makapp://oauth/callback?provider=spotify&ok=1
        const u = new URL(url);
        if (u.host === 'oauth' && u.pathname === '/callback') {
          const provider = u.searchParams.get('provider');
          const ok = u.searchParams.get('ok');
          // After OAuth, refresh providers
          await refresh();
          onDone?.({ provider, ok: ok === '1' });
        }
      } catch {}
    };

    const sub = Linking.addEventListener('url', handler);
    // Also handle cold-start
    Linking.getInitialURL().then(initial => {
      if (initial) handler({ url: initial });
    });

    return () => sub.remove();
  }, [refresh, onDone]);
}
