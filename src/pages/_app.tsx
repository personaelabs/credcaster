import { Header } from '@/components/Header';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        defer
        data-domain="traitcaster.vercel.app"
        src="https://plausible.io/js/script.js"
      ></Script>
      <Header></Header>
      <Head>
        <link type="favicon" rel="icon" href="/personae.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
