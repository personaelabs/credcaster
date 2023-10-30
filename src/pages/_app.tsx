import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        defer
        data-domain="traitcaster.vercel.app"
        src="https://plausible.io/js/script.js"
      ></Script>
      <Component {...pageProps} />
    </>
  );
}
