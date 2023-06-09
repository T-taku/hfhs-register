import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react'
import { Session } from "next-auth"
import { RecoilRoot } from 'recoil';
import { Notifications } from '@mantine/notifications';
import Script from "next/script";
import * as gtag from "../lib/gtag";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  const router = useRouter();
    useEffect(() => {
      const handleRouterChange = (url: any) => {
        gtag.pageview(url);
      };
      router.events.on("routeChangeComplete", handleRouterChange);
      return () => {
        router.events.off("routeChangeComplete", handleRouterChange);
      };
    }, [router.events]);
  return (
    <>
      <Head>
        <meta name="theme-color" content="#2B8A3E" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </Head>
      <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gtag.GA_MEASUREMENT_ID}');
            `,
          }}
        />
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >
        <Notifications />
        <SessionProvider session={pageProps.session}><RecoilRoot><Component {...pageProps} /></RecoilRoot></SessionProvider>
      </MantineProvider>
    </>
  );
}