import Head from 'next/head'
import { Comp_Navbar } from '../../components/Navbar'
import Historytable from '../../components/Historytable';
import Earn from '../../components/Earn';
import { AppShell, Button, Title } from '@mantine/core';
import type { API } from '@/utils/initAPI';
import { type AddHistoryHistoryAddClassNamePostRequest, ResponseError, type ResponseHistory, type ResponseSetting, type ResponseUser } from '@/utils/openapi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HistoryQueuetable from '@/components/HistoryQueuetable';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCircleX } from '@tabler/icons-react';


export default function History({ api, userData }: { api: API | undefined, userData: ResponseUser | undefined }) {
    const [paymentData, setPaymentData] = useState<ResponseHistory[]>([]);
    const [paymentQueueData, setPaymentQueueData] = useState<AddHistoryHistoryAddClassNamePostRequest[]>([]);
    const [settingData, setSettingData] = useState<ResponseSetting | undefined>(undefined);

    const sendHistoryQueue = () => {
        if (!api) return;
        api.sendHistoryQueue().then((res) => {
            if (res.length > 0) {
                if (res.every(val => val.result)) {
                    notifications.show({
                        id: 'done-queuesend',
                        withCloseButton: true,
                        autoClose: 5000,
                        title: "決済が正常に記録されました",
                        message: "決済記録が正常に記録されました。",
                        color: 'green',
                        icon: <IconCheck />,
                        className: 'my-notification-class',
                        loading: false,
                    });
                } else {
                    notifications.show({
                        id: 'error-queuesend',
                        withCloseButton: true,
                        autoClose: 5000,
                        title: "送信できませんでした",
                        message: "アプリの再起動時に再試行されます。",
                        color: 'red',
                        icon: <IconCircleX />,
                        className: 'my-notification-class',
                        loading: false,
                    });
                }
            }
        }).finally(() => {
            getHistoryQueue()
        })
    }

    const getHistoryQueue = () => {
        if (!api) return;
        api.getHistoryQueue().then((res) => {
            setPaymentQueueData(res);
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
        getHistoryQueue()
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
                        <Title order={2}>売上確認<Button onClick={fetchHistory}>更新</Button></Title>
                        <br />
                        <Earn paymentData={paymentData} settingData={settingData}></Earn>
                        <br />
                        {
                            paymentQueueData.length > 0 && 
                            (<>
                                <Title order={3}>送信待機中の会計履歴</Title><Button onClick={() => {sendHistoryQueue()}}>送信</Button>
                                <HistoryQueuetable paymentData={paymentQueueData}></HistoryQueuetable>
                            </>)
                        }
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
