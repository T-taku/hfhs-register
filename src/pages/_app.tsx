import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react'

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
        <SessionProvider session={session}><Component {...pageProps} /></SessionProvider>
      </MantineProvider>
    </>
  );
}