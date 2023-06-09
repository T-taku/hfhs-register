import Head from 'next/head'
import { Comp_Navbar } from '../../components/Navbar'
import Historytable from '../../components/Historytable';
import Earn from '../../components/Earn';
import { AppShell, Button, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import type { API } from '@/utils/initAPI';
import { ResponseError, ResponseHistory, ResponseSetting, ResponseUser } from '@/utils/openapi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


export default function History({ api, userData }: { api: API | undefined, userData: ResponseUser | undefined }) {
    const [paymentData, setPaymentData] = useState<ResponseHistory[]>([]);
    const [settingData, setSettingData] = useState<ResponseSetting | undefined>(undefined);

    const fetchHistory = () => {
        if(!api || !userData) return;
        api.fetchHistory({ className: userData!.userClass }).then((res) => {
            setPaymentData(res);
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
        api.getStoreSetting({ className: userData!.userClass }).then((res) => {
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

    const router = useRouter();

    useEffect(() => {
        if (!api) return;
        api.getIslogin().then((res) => {}).catch(() => {
            router.replace("/auth/signin");
        })
    }, [api])

    useEffect(() => {
        if (!api || !userData) return;
        api.getHistory({ className: userData.userClass }).then((res) => {
            setPaymentData(res);
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
        api.getStoreSetting({ className: userData!.userClass }).then((res) => {
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
    }, [api, userData])

    return (
        <>
            <Head>
                <title>売上確認 | HFHS REGI SYS</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {
                userData && (
                    <AppShell
                        navbar={<Comp_Navbar page="売上確認" username={userData && userData.userName || "ゲスト"} storeName={`${userData?.userClass ?? "取得中..."} | HFHS REGI`} />}
                    >
                        <Title order={2}>売上確認 <Button onClick={fetchHistory}>更新</Button></Title>
                        <br />
                        <Earn paymentData={paymentData} settingData={settingData}></Earn>
                        <br />
                        <Title order={3}>会計履歴</Title>
                        <br />
                        <Historytable paymentData={paymentData}></Historytable>
                    </AppShell>
                )
            }
        </>
    )
}
