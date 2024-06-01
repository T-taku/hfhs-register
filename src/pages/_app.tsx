import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react'
import { Session } from "next-auth"
import { RecoilRoot } from 'recoil';
import { Notifications } from '@mantine/notifications';
import Script from "next/script";
import * as gtag from "../lib/gtag";
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '@/utils/RegiAPI';
import { RegiAPI } from '@/utils/RegiAPI';
import { APIProvider } from '@/components/APIProvider';
import { UserinfoProvider } from '@/components/UserinfoProvider';

export default function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  const router = useRouter();
  useEffect(() => {
    router.events.on("routeChangeComplete", gtag.pageview);
    return () => {
      router.events.off("routeChangeComplete", gtag.pageview);
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
        <SessionProvider session={pageProps.session}>
          <RecoilRoot>
            <APIProvider>
              <UserinfoProvider>
                <Component {...pageProps} />
              </UserinfoProvider>
            </APIProvider>
          </RecoilRoot>
        </SessionProvider>
      </MantineProvider>
    </>
  );
}