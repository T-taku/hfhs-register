import Head from 'next/head'
import { Comp_Navbar } from '../components/Navbar'
import { NumPad } from '../components/Numpad'
import { useSession } from 'next-auth/react';
import { AppShell, Container, Title, Text, Button, rem, Flex, Table, Mark, Modal, Center, SimpleGrid } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBrandGoogle, IconCheck, IconCircleX, IconCoins } from '@tabler/icons-react';
import { signIn } from 'next-auth/react';
import productsByClass, { Product } from '../utils/product';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useRecoilState } from 'recoil';
import { amountPaidState } from "../utils/states";
import { useApi } from '@/utils/useApi';
import { FetchError, ResponseError, type ResponseUser } from '@/utils/openapi';

export default function Home() {
    const [opened, { open, close }] = useDisclosure(false);
    const [amountPaid, setamountPaid] = useRecoilState(amountPaidState);
    const { data: session } = useSession();
    const [order, setOrder] = useState<OrderItem[]>([]);
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
        })
    }, [userData])

    const products = productsByClass[(userData?.userClass) || ""]?.map((element) => (
        (element.id).includes("_")
        ? <tr key={element.id}>
            <Button color="red" size={ "xl" } onClick={() => handleOrder(element)}>{ element.name }</Button>
        </tr>
        : <tr key={element.id}>
            <Button size={ "xl" } onClick={() => handleOrder(element)}>{ element.name }</Button>
        </tr>
    ));

    const products_normal_count=productsByClass[(userData?.userClass) || "" ]?.filter(element => !element.id.includes("_")).length

    type OrderItem = {
        product: Product;
        count: number;
    }

    async function retryAddHistory(api:any, requestParameters:any, maxRetries:number, retryDelay:number) {
        let retries = 0;
        while (retries < maxRetries) {
            try {
                await api.addHistoryHistoryAddClassNamePost(requestParameters);
                return;
            } catch (error) {
                retries++;
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
        notifications.show({
            id: 'error',
            withCloseButton: true,
            autoClose: 5000,
            title: "決済が正常に記録できていません",
            message: '決済記録が正常に記録されていません。再試行回数の上限に達しました。',
            color: 'red',
            icon: <IconCircleX />,
            className: 'my-notification-class',
            loading: false,
        });
    }

    async function resetall(){
        const requestParameters = {
            className: String(userData?.userClass),
            change: calculateChange(Number(amountPaid.join("")), calculateTotalPrice(order)),
            total: calculateTotalPrice(order),
            product: order.map((item) => `${item.product.name}:${item.count}個`).join(','),
        }
        try {
            api.addHistoryHistoryAddClassNamePost(requestParameters).then(_response => {
                notifications.show({
                    id: 'donerecord',
                    withCloseButton: true,
                    autoClose: 5000,
                    title: "決済が完了しました", 
                    message: '決済記録が正常に記録されました。',
                    color: 'green',
                    icon: <IconCheck />,
                    className: 'my-notification-class',
                    loading: false,
                });
            })
        } catch (error: any) {
            await retryAddHistory(api, requestParameters, 3, 5000);
        }
        setamountPaid([]);
        setOrder([]);
    }

    function handleOrder(product: Product) {
        const index = order.findIndex((item) => item.product.id === product.id);
    
        if (index === -1) {
            setOrder((prevOrder) => [...prevOrder, { product, count: 1 }]);
        } else {
            const newOrder = [...order];
            newOrder[index].count++;
            setOrder(newOrder);
        }
    }

    function deleteItemFromOrder(index:number) {
        setOrder((prevOrder) => {
            const newOrder = [...prevOrder];
            newOrder.splice(index, 1);
            return newOrder;
        });
    }

    function calculateTotalPrice(order: OrderItem[]): number {
        let totalPrice = 0;
        for (const item of order) {
          totalPrice += item.product.price * item.count;
        }
        return totalPrice;
    }

    function calculateChange(amountPaid: number, totalPrice: number) {
        return amountPaid - totalPrice;
    }

    return (
        <>
            <Head>
                <title>HFHS REGI SYS</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {
                session && (
                    <AppShell
                        navbar={<Comp_Navbar page="会計" username={session.user && session.user.name || "ゲスト"} storeName={`${userData?.userClass ?? "取得中..."} | HFHS REGI`} />}
                    >
                        <Flex
                                mih={50}
                                gap="sm"
                                justify="flex-end"
                                align="center"
                                direction="column"
                                wrap="wrap"
                        >
                            <Title order={3}>商品一覧</Title>
                            <SimpleGrid cols={products_normal_count} spacing="xs">
                                {products}
                            </SimpleGrid>
                            <Text>赤色の商品は、割引額が登録されています。</Text>
                        </Flex>
                        <SimpleGrid cols={0}>
                            <Flex
                                mih={50}
                                gap="sm"
                                justify="flex-end"
                                align="center"
                                direction="column"
                                wrap="wrap"
                            >
                                <Title order={3}>購入商品</Title>
                                <Table verticalSpacing="lg" striped>
                                <thead>
                                    <tr>
                                    <th>商品</th>
                                    <th>値段</th>
                                    <th>個数</th>
                                    <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.map((item, index) => (
                                        <tr key={index}>
                                        <td>{item.product.name}</td>
                                        <td>¥{item.product.price}</td>
                                        <td>{item.count}</td>
                                        <td><a onClick={() => deleteItemFromOrder(index)}>削除</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                                </Table>
                                {
                                    (order.length > 0)&&
                                    <>
                                        <Title order={5}>合計金額: <Mark color={"red"}>{calculateTotalPrice(order)}円</Mark></Title>
                                        <Button
                                            leftIcon={
                                                <IconCoins size="1.2rem" stroke={1.5} />
                                            }
                                            radius="xl"
                                            size="md"
                                            color="red"
                                            styles={{
                                            root: { paddingRight: rem(14), height: rem(48) },
                                            }}
                                            onClick={open}
                                        >
                                            支払いへ進む
                                        </Button>
                                    </>
                                }
                            </Flex>
                        </SimpleGrid>
                        <Modal opened={opened} onClose={close} title="支払いへ進む">
                            合計金額: {calculateTotalPrice(order)}円
                            <NumPad/>
                            {Number(amountPaid.join("")) >= calculateTotalPrice(order) && (
                                <div>
                                    お釣り: {calculateChange(Number(amountPaid.join("")), calculateTotalPrice(order))}円
                                </div>
                            )}
                            <br/>
                            <Center>
                            <Button
                                leftIcon={
                                    <IconCoins size="1.2rem" stroke={1.5} />
                                }
                                radius="xl"
                                size="md"
                                color="green"
                                disabled={!(Number(amountPaid.join("")) >= calculateTotalPrice(order))}
                                styles={{
                                root: { paddingRight: rem(14), height: rem(48) },
                                }}
                                onClick={
                                    ()=>{close(); resetall();}
                                }
                            >
                                支払いを完了
                            </Button>
                            </Center>
                        </Modal>
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
    );
}