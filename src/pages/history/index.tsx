import Head from 'next/head'
import { Comp_Navbar } from '../../components/Navbar'
import { AppShell, Container, Title, Text, Button, rem, Flex, Grid, Table, Mark, Modal, Center, SimpleGrid, Card, Progress, Accordion, createStyles } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useApi } from '@/utils/useApi';
import { FetchError, ResponseError, type ResponseUser, type History } from '@/utils/openapi';
import { useEffect, useState } from 'react';


export default function History() {
    const { data: session } = useSession()
    const [userData, setUserData] = useState<ResponseUser | undefined>();
    const [historyData, setHistoryData] = useState<History | undefined>();
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
        })
        const requestParameters = {
            className: String(userData?.userClass),
        }
        api.getAllHistoryHistoryClassNameGet(requestParameters).then((res) => {
            setHistoryData(res);
            console.log(res)
        }).catch((e: Error) => {
            if (e instanceof ResponseError) {
                if (e.response.status === 500) {
                    throw e
                } else {
                    //それ以外は無視とする
                }
            }
        })
    }, [])

    const useStyles = createStyles((theme) => ({
        wrapper: {
            paddingTop: `calc(${theme.spacing.xl} * 2)`,
            paddingBottom: `calc(${theme.spacing.xl} * 2)`,
            minHeight: 650,
        },
        
        title: {
            marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
        },
        
        item: {
            borderRadius: theme.radius.md,
            marginBottom: theme.spacing.lg,
            border: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
        },
        }));
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
                        {historyData || "ありません"}
                        <Title order={2}>売上確認</Title>
                        <br/>
                        <Card
                            withBorder
                            radius="md"
                            padding="xl"
                        >
                        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                            現在の売り上げ
                        </Text>
                        <Text fz="lg" fw={500}>
                            ¥50,431 / ¥100,0000
                        </Text>
                        <Progress value={50.431} mt="md" size="lg" radius="xl" />
                        </Card>
                        <br/>
                        <Title order={3}>会計履歴</Title>
                        <br/>
                        <Accordion variant="separated">
                            <Accordion.Item className="2023-05-24-13-50" value="history_1">
                            <Accordion.Control>5月24日 11時50分</Accordion.Control>
                            <Accordion.Panel>
                            <Table miw={700}>
                                <thead className="tekitou">
                                <tr>
                                    <th>購入日時</th>
                                    <th>購入商品</th>
                                    <th>金額</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr key="5_24_11_50">
                                    <td>5月24日 11時50分</td>
                                    <td>かき氷1</td>
                                    <td>200円(預かり金: 500円 / お釣り: 300円)</td>
                                </tr>
                                </tbody>
                            </Table>
                            </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </AppShell>
                )
            }
        </>
    )
}
