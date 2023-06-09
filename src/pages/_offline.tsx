import Head from 'next/head'
import { Text, Container } from '@mantine/core';

export default function Home() {
    return (
        <>
            <Head>
                <title>HFHS REGI SYS</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container><Text>オフラインです</Text><Text>このアプリを使用するには、まずインターネットに接続してください。</Text></Container>
        </>
    );
}