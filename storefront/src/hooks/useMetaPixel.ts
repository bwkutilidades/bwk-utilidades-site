import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PIXEL_ID = '2005189303360516';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

export function useMetaPixel() {
  // Inicializa o Pixel uma única vez na montagem
  useEffect(() => {
    if (window.fbq) return;

    // Código base oficial da Meta — não modificar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (function (f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }, []); // [] = executa apenas na montagem inicial

  // Dispara PageView a cada troca de rota (SPA)
  const location = useLocation();
  useEffect(() => {
    if (!window.fbq) return;
    window.fbq('track', 'PageView');
  }, [location.pathname]);
}
