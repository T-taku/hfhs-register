import Head from 'next/head'
import { Comp_Navbar } from '../../components/Navbar'
import Historytable from '../../components/Historytable';
import Earn from '../../components/Earn';
import { AppShell, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import type { API } from '@/utils/initAPI';
import type { ResponseUser } from '@/utils/openapi';


export default function History({ api, userData }: { api: API | undefined, userData: ResponseUser }) {
    const { data: session } = useSession({required: true})

    return (
        <>
            <Head>
                <title>売上確認 | HFHS REGI SYS</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {
                session && (
                    <AppShell
                        navbar={<Comp_Navbar page="売上確認" username={session.user && session.user.name || "ゲスト"} storeName={`${userData?.userClass ?? "取得中..."} | HFHS REGI`} />}
                    >
                        <Title order={2}>売上確認</Title>
                        <br />
                        <Earn></Earn>
                        <br />
                        <Title order={3}>会計履歴</Title>
                        <br />
                        <Historytable></Historytable>
                    </AppShell>
                )
            }
        </>
    )
}
