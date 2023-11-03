import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';

import Head from 'next/head';
import { Header } from '@/components/Header';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        defer
        data-domain="traitcaster.vercel.app"
        src="https://plausible.io/js/script.js"
      ></Script>

      <Head>
        <link type="favicon" rel="icon" href="/personae.ico" />
      </Head>
      <Header></Header>

      <div className="mb-4 flex min-h-screen w-full justify-center bg-gray-50">
        <Component {...pageProps} />
      </div>
    </>
  );
}
