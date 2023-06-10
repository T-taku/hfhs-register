import Head from 'next/head'
import { Comp_Navbar } from '../../components/Navbar'
import { AppShell, Title, Text, Button, Center, NumberInput } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { IconCheck, IconCircleX } from '@tabler/icons-react';
import type { API } from '@/utils/initAPI';
import { ResponseError, type ResponseUser, type ResponseSetting } from '@/utils/openapi';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';

export default function History({ api, userData }: { api: API | undefined, userData: ResponseUser }) {
    const { data: session } = useSession({ required: true })
    const [settingData, setSettingData] = useState<ResponseSetting | undefined>();
    const [goal, setGoal] = useState<number | ''>(0);
    const [reserve, setReserve] = useState<number | ''>(0);
    const [additionalreserve, setAdditionalreserve] = useState<number | ''>(0);
    additionalreserve

    async function get_api() {
        if (!api) return;
        api.getStoreSetting(requestParameters).then((res) => {
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

    const requestParameters = {
        className: String(userData?.userClass)
    }
    useEffect(() => {
        if (api && userData) {
            api.getStoreSetting(requestParameters).then((res) => {
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
    }, [userData, api])

    async function saveSetting() {
        if (!api) return
        const requestParameters = {
            className: String(userData?.userClass),
            goal: Number(goal),
            reserve: Number(reserve),
            additionalreserve: Number(additionalreserve),
        }
        try {
            api.setStoreSetting(requestParameters).then(_response => {
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
                api.getStoreSetting(requestParameters).then((res) => {
                    setSettingData(res);
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
                    <Text>ここでの目標売上は、1日での売上額を指定してください。売上確認ページに反映されます。(現在の設定額: {String(settingData?.goal ?? "設定なし")}円)</Text>
                    <NumberInput size="sm" label="目標売り上げ" placeholder={String(settingData?.goal ?? "設定なし")} className="" onChange={setGoal} />
                    <br />
                    <Title order={3}>準備金</Title>
                    <Text>生徒と先生の準備金の合計を入力してください。(現在の設定額: {String(settingData?.reserve ?? "設定なし")}円)</Text>
                    <NumberInput size="sm" label="準備金" placeholder={String(settingData?.reserve ?? "設定なし")} className="" onChange={setReserve} />
                    <br />
                    <Title order={3}>追加準備金</Title>
                    <Text>追加で必要になった準備金を入力してください。(現在の設定額: {String(settingData?.additionalreserve ?? "設定なし")}円)</Text>
                    <NumberInput size="sm" label="準備金" placeholder={String(settingData?.additionalreserve ?? "設定なし")} className="" onChange={setReserve} />
                    <br />
                    <Center>
                        <Button size={"md"} onClick={() => { saveSetting() }}>保存</Button>
                    </Center>
                </AppShell>
            )}
        </>
    )
}