import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react'
import { Session } from "next-auth"
import { RecoilRoot } from 'recoil';
import { Notifications } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <>
      <Head>
        <title>東福岡学園祭レジ</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
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