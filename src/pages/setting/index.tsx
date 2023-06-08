import Head from 'next/head'
import { Comp_Navbar } from '../../components/Navbar'
import { AppShell, Container, Title, Text, Button, rem, Flex, Grid, Table, Mark, Modal, Center, SimpleGrid, Card, Progress, Accordion, createStyles, TextInput, NumberInput } from '@mantine/core';
import { signIn, useSession } from 'next-auth/react';
import { IconBrandGoogle, IconCheck, IconCircleX } from '@tabler/icons-react';
import { useApi } from '@/utils/useApi';
import { FetchError, ResponseError, type ResponseUser, type ResponseSetting } from '@/utils/openapi';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';

export default function History() {
    const { data: session } = useSession()
    const fetchjwt = async () => {
        const response = await fetch('/api/auth/jwt');
        const data = await response.text();
        return data
    }
    const [userData, setUserData] = useState<ResponseUser | undefined>();
    const [settingData, setSettingData] = useState<ResponseSetting[]>([]);
    const [goal, setGoal] = useState<number | ''>(0);
    const [reserve, setReserve] = useState<number | ''>(0);
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
        })
    }, [])

    const requestParameters = {
        className: String(userData?.userClass)
    }
    useEffect(() => {
        if (userData) {
            api.getSettingSettingClassNameGet(requestParameters).then((res) => {
            setSettingData(res);
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
        }
    }, [userData])

    async function saveSetting() {
    const requestParameters = {
        className: String(userData?.userClass),
        goal: Number(goal),
        reserve: Number(reserve)
    }
    try {
        api.setSettingSettingSetClassNamePost(requestParameters).then(_response => {
        notifications.show({
            id: 'donerecord',
            withCloseButton: true,
            autoClose: 5000,
            title: "設定を保存しました。",
            message: '設定を正常に保存できました。',
            color: 'green',
            icon: <IconCheck />,
            className: 'my-notification-class',
            loading: false,
        });
        })
    } catch (error: any) {
        notifications.show({
        id: 'badrequest',
        withCloseButton: true,
        autoClose: 5000,
        title: "正常に保存できませんでした。",
        message: '設定が正常に保存されていません。もう一度お試しください。',
        color: 'red',
        icon: <IconCircleX />,
        className: 'my-notification-class',
        loading: false,
        });
    }
    }

    return (
    <>
        <Head>
        <title>店舗設定 | HFHS REGI SYS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
        {session && (
        <AppShell
            navbar={<Comp_Navbar page="店舗設定" username={session.user && session.user.name || "ゲスト"} storeName={`${userData?.userClass ?? "取得中..."} | HFHS REGI`} />}
        >
            <Title order={2}>店舗設定</Title>
            <br />
            <Title order={3}>目標売り上げ</Title>
            <Text>ここでの目標売上は、1日での売上額を指定してください。売上確認ページに反映されます。(現在の設定額: {String(settingData?.goal)}円)</Text>
            <NumberInput size="sm" label="目標売り上げ" placeholder={String(settingData?.goal)} className="" onChange={setGoal} />
            <br />
            <Title order={3}>準備金</Title>
            <Text>生徒と先生の準備金の合計を入力してください。(現在の設定額: {String(settingData?.reserve)}円)</Text>
            <NumberInput size="sm" label="準備金" placeholder={String(settingData?.reserve)} className="" onChange={setReserve} />
            <br />
            <Center>
            <Button size={"md"} onClick={() => { saveSetting() }}>保存</Button>
            </Center>
        </AppShell>
        )}
        {!session && (
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
        )}
    </>
    )
}