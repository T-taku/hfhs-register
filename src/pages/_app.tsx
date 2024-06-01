import { APIProvider } from '@/components/APIProvider';
import { UserinfoProvider } from '@/components/UserinfoProvider';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from "next/script";
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import * as gtag from "../lib/gtag";

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          components: {
            Text: {
              styles: {
                root: {
                  margin: "0em"
                }
              }
            },
            NumberInput: {
              styles: {
                label: {
                  fontSize: "1.5em",
                  fontWeight: "bold"
                },
                description: {
                  color: "black",
                  fontSize: "0.9em"
                }
              }
            },
            Tabs: {
              styles: {
                tabLabel: {
                  fontSize: "1.2em",
                  fontWeight: "bold"
                },
                tab: {
                  borderBottom: "0.3rem solid transparent"
                }
              }
            }
          }
        }}
      >
        <Notifications />
        <SessionProvider session={pageProps.session}>
          <RecoilRoot>
            <APIProvider>
              {
                !router.pathname.includes("/auth") ?
                  (
                    <UserinfoProvider>
                      <Component {...pageProps} />
                    </UserinfoProvider>
                  ) : (
                    <Component {...pageProps} />
                  )
              }
            </APIProvider>
          </RecoilRoot>
        </SessionProvider>
      </MantineProvider>
    </>
  );
}