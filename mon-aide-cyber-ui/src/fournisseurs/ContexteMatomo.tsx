import { createContext, PropsWithChildren, useEffect } from 'react';

export const ContexteMatomo = createContext({});

declare global {
  interface Window {
    _mtm: any;
    _paq: any;
  }
}

export const FournisseurMatomo = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const genereLeTagManager = () => {
      const matomoTagManager = (window._mtm = window._mtm || []);
      matomoTagManager.push({
        'mtm.startTime': new Date().getTime(),
        event: 'mtm.Start',
      });
      const d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0];
      g.async = true;
      g.src = import.meta.env.VITE_MATOMO_URL;
      s.parentNode?.insertBefore(g, s);
    };

    const genereLePaquetMatomo = () => {
      const paquetMatomo = (window._paq = window._paq || []);
      paquetMatomo.push(['trackPageView']);
      paquetMatomo.push(['enableLinkTracking']);
      (function () {
        const u = 'https://stats.beta.gouv.fr/';
        paquetMatomo.push(['setTrackerUrl', u + 'matomo.php']);
        paquetMatomo.push(['setSiteId', import.meta.env.VITE_MATOMO_SITE_ID]);
        const d = document,
          g = d.createElement('script'),
          s = d.getElementsByTagName('script')[0];
        g.async = true;
        g.src = u + 'matomo.js';
        s.parentNode?.insertBefore(g, s);
      })();
    };

    genereLeTagManager();
    genereLePaquetMatomo();
  }, []);

  return (
    <ContexteMatomo.Provider value={{}}>{children}</ContexteMatomo.Provider>
  );
};
