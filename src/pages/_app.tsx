import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil';
import { Notifications } from '@mantine/notifications';

export default function App(props: AppProps) {
  const { Component, pageProps:{session, ...pageProps} } = props;

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
        <SessionProvider session={session}><RecoilRoot><Component {...pageProps} /></RecoilRoot></SessionProvider>
      </MantineProvider>
    </>
  );
}