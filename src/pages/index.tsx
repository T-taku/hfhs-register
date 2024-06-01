import { notif } from '@/utils/notif';
import { useAPI } from '@/utils/useAPI';
import { useUserinfo } from '@/utils/useUserinfo';
import { AppShell, Button, Center, Flex, Mark, Modal, SimpleGrid, Table, Text, Title, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowBigLeftLine, IconCheck, IconCircleX, IconCoins } from '@tabler/icons-react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Comp_Navbar } from '../components/Navbar';
import { NumPad } from '../components/Numpad';
import productsByClass, { Product } from '../utils/product';
import { amountPaidState } from "../utils/states";

export default function Home() {
  const api = useAPI();
  const userData = useUserinfo();

  const [opened, { open, close }] = useDisclosure(false);
  const [amountPaid, setamountPaid] = useRecoilState(amountPaidState);
  const [magnification, setMagnification] = useState<number>(1);
  const [order, setOrder] = useState<OrderItem[]>([]);

  const products = productsByClass[userData?.userClass ?? ""] ?? [];

  const productsElement = products.map((element) => (
    (element.id).includes("_")
      ? <div key={element.id}>
        <Button color="red" size={"xl"} onClick={() => handleOrder(element)}>{element.name}</Button>
      </div>
      : <div key={element.id}>
        <Button size={"xl"} onClick={() => handleOrder(element)}>{element.name}</Button>
      </div>
  ));

  const products_normal_count = productsByClass[(userData?.userClass) ?? ""]?.filter(element => !element.id.includes("_")).length

  type OrderItem = {
    product: Product;
    count: number;
  }

  async function resetall(times: number = 1) {
    const requestParameters = times > 0 ? {
      className: userData?.userClass!,
      change: calculateChange(parseInt(amountPaid.join(""), 10), calculateTotalPrice(order, times), times),
      total: calculateTotalPrice(order, times),
      product: order.map((item) => `${item.product.name}:${item.count * times}個`).join(','),
    } : {
      className: userData?.userClass!,
      change: 0,
      total: -calculateChange(parseInt(amountPaid.join(""), 10), calculateTotalPrice(order, times), times),
      product: "返金対応",
    }
    api?.addHistory(requestParameters).then(response => {
      if (response.status == "COMPLETE") {
        notif("DONERECORD");
      } else {
        notif("QUEUE");
      }
    }).catch(e => {
      const error = e as Error;
      notif("ERROR", error);
    })
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

  function deleteItemFromOrder(index: number) {
    setOrder((prevOrder) => {
      const newOrder = [...prevOrder];
      newOrder.splice(index, 1);
      return newOrder;
    });
  }

  function calculateTotalPrice(order: OrderItem[], times: number = 1): number {
    let totalPrice = 0;
    for (const item of order) {
      totalPrice += item.product.price * item.count * times;
    }
    return totalPrice;
  }

  function calculateChange(amountPaid: number, totalPrice: number, times: number = 1) {
    return times > 0 ? amountPaid - totalPrice : amountPaid + totalPrice;
  }


  useEffect(() => {
    api?.flushHistory().then((res) => {
      if (res.status == "COMPLETE") {
        notif("SENT");
      } else if (res.status == "IN-QUEUE") {
        notif("FAILWARN");
      }
    })
  }, [api])

  return (
    <>
      <Head>
        <title>HFHS REGI SYS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        navbar={<Comp_Navbar page="会計" />}
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
            {productsElement}
          </SimpleGrid>
          <Text>赤色の商品は、割引額が登録されています。ボタンが繋がっている場合は、文字の上を押して下さい。</Text>
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
              (order.length > 0) &&
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
                  onClick={() => { setMagnification(1); open() }}
                >
                  支払いへ進む
                </Button>
              </>
            }
            <Button
              leftIcon={
                <IconArrowBigLeftLine size="0.8rem" stroke={1.5} />
              }
              radius="xl"
              size="sm"
              color="blue"
              styles={{
                root: { paddingRight: rem(14), height: rem(48) },
              }}
              onClick={() => { setMagnification(-1); open() }}
            >
              返金対応
            </Button>
          </Flex>
        </SimpleGrid>
        <Modal opened={opened} onClose={close} title={magnification > 0 ? "支払いへ進む" : "返金対応"}>
          {magnification > 0 && (<>
            合計金額: {calculateTotalPrice(order)}円
          </>)}
          <NumPad refund={(magnification > 0)} />
          {magnification > 0 && parseInt(amountPaid.join(""), 10) >= calculateTotalPrice(order) && (
            <div>
              お釣り: {calculateChange(Number(amountPaid.join("")), calculateTotalPrice(order))}円
            </div>
          )}
          <br />
          <Center>
            <Button
              leftIcon={
                <IconCoins size="1.2rem" stroke={1.5} />
              }
              radius="xl"
              size="md"
              color={magnification > 0 ? "green" : "blue"}
              disabled={!(parseInt(amountPaid.join("")) >= calculateTotalPrice(order)) && magnification > 0}
              styles={{
                root: { paddingRight: rem(14), height: rem(48) },
              }}
              onClick={
                () => { close(); resetall(magnification); }
              }
            >
              {magnification > 0 ? "支払い" : "返金"}を完了
            </Button>
          </Center>
        </Modal>
      </AppShell>
    </>
  );
}