import { useEffect, useState } from 'react';
import { initAPI } from '@/utils/initAPI';
import { ResponseError, type ResponseUser, type ResponseHistory, ResponseSetting } from '@/utils/openapi';
import { Card, Progress, Text } from '@mantine/core';
import 'dayjs/locale/ja';

export default function Earn() {
    const [paymentData, setPaymentData] = useState<ResponseHistory[]>([]);
    const [userData, setUserData] = useState<ResponseUser | undefined>();
    const [settingData, setSettingData] = useState<ResponseSetting | undefined>();
    const fetchjwt = async () => {
        const response = await fetch('/api/auth/jwt');
        const data = await response.text();
        return data
    }

    const api = initAPI(fetchjwt);

    useEffect(() => {
        api.getUserinfo().then((res) => {
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
        })}, [])
    
    const requestParameters={
        className: String(userData?.userClass)
    }
    useEffect(() => {
        if (userData) {
            api.getHistory(requestParameters).then((res) => {
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
        }
    }, [userData])

    useEffect(() => {
        if (userData) {
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
    }, [userData])
    
    const totalSum = paymentData.reduce((sum, item) => {
        if (typeof item.total === 'number') {
            return sum + item.total;
        }
        return sum;
    }, 0);
    
    return (
        <>
            {
                settingData && (
                    <>
                        <Card withBorder radius="md" padding="xl">
                            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                                現在の売り上げ
                            </Text>
                            <Text fz="lg" fw={500}>
                                ¥{totalSum} / ¥{settingData?.goal + settingData.reserve}
                            </Text>
                            <Text>目標金額には、準備金が含まれています。</Text>
                            <Progress value={(totalSum / settingData?.goal) * 100} mt="md" size="lg" radius="xl" />
                        </Card>
                    </>
                )
            }
            {
                !settingData && (
                    <>
                        <Card withBorder radius="md" padding="xl">
                            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                                現在の売り上げ
                            </Text>
                            <Text fz="lg" fw={500}>
                                ¥{totalSum}
                            </Text>
                            <Text>設定ページにて、設定を保存すると現在の売上が、どのくらい目標金額に近づいているかを確認できます。</Text>
                        </Card>
                    </>
                )
            }
        </>
    );
}