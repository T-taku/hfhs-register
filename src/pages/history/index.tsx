import Head from 'next/head'
import { Comp_Navbar } from '../../components/Navbar'
import Historytable from '../../components/Historytable';
import Earn from '../../components/Earn';
import { AppShell, Title, Text, rem, Table, Card, Progress, Accordion, createStyles, Button, Container } from '@mantine/core';
import { signIn, useSession } from 'next-auth/react';
import { useApi } from '@/utils/useApi';
import { ResponseError, type ResponseUser } from '@/utils/openapi';
import { useEffect, useState } from 'react';
import { IconBrandGoogle } from '@tabler/icons-react';


export default function History() {
    const { data: session } = useSession()
    const [userData, setUserData] = useState<ResponseUser | undefined>();
    const fetchjwt = async () => {
        const response = await fetch('/api/auth/jwt');
        const data = await response.text();
        return data
    }

    const api = useApi(fetchjwt);

    useEffect(() => {
        api.getUserinfoUserGet().then((res) => {
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
        })}, [userData])

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
                        <br/>
                        <Earn></Earn>
                        <br/>
                        <Title order={3}>会計履歴</Title>
                        <br/>
                        <Historytable></Historytable>
                    </AppShell>
                )
            }
            {
                !session && (
                    <Container
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100vh",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Title order={2}>ログイン</Title>
                        <Text>学校のGoogleアカウントを使って、ログインしてください。</Text>
                        <Button
                            leftIcon={
                                <IconBrandGoogle size="1.2rem" stroke={1.5} />
                            }
                            radius="xl"
                            size="md"
                            styles={{
                            root: { paddingRight: rem(14), height: rem(48) },
                            }}
                            onClick={() => signIn()}
                        >
                            Googleでログイン
                        </Button>
                    </Container>
                )
            }
        </>
    )
}
