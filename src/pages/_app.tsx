import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react'
import { Session } from "next-auth"
import { RecoilRoot } from 'recoil';
import { Notifications } from '@mantine/notifications';
import Script from "next/script";
import * as gtag from "../lib/gtag";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ResponseError, ResponseUser } from '@/utils/openapi';
import { API, initAPI } from '@/utils/initAPI';

export default function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  const [userData, setUserData] = useState<ResponseUser | undefined>();
  const [api, setAPI] = useState<API | undefined>();
  const fetchjwt = async () => {
    const response = await fetch('/api/auth/jwt');
    const data = await response.text();
    return data
  }

  useEffect(() => {
    initAPI(fetchjwt).then((resApi) => {
      setAPI(resApi);
    })
  }, [])

  useEffect(() => {
    if (!api) return;
    api.getUserinfo().then((res) => {
      setUserData(res);
    }).catch((e: Error) => {
      if (e instanceof ResponseError) {
        if (e.response.status === 500) {
          throw e
        } else {
          //それ以外は無視とする
        }
      } else {
        throw e;
      }
    })
  }, [api])

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
        <SessionProvider session={pageProps.session}><RecoilRoot><Component api={api} userData={userData} {...pageProps} /></RecoilRoot></SessionProvider>
      </MantineProvider>
    </>
  );
}