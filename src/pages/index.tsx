import { notif } from "@/utils/notif";
import { useAPI } from "@/utils/useAPI";
import { useUserinfo } from "@/utils/useUserinfo";
import {
  AppShell,
  Button,
  Flex,
  Group,
  Mark,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBigLeftLine, IconCoins } from "@tabler/icons-react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Comp_Navbar } from "../components/Navbar";
import productsByClass, { Product } from "../utils/product";
import PaymentModal from "@/components/PaymentModal";
import RefundModal from "@/components/RefundModal";

export default function Home() {
  const api = useAPI();
  const userData = useUserinfo();

  const [
    paymentModalOpened,
    { open: openPaymentModal, close: closePaymentModal },
  ] = useDisclosure(false);
  const [
    refundModalOpened,
    { open: openRefundModal, close: closeRefundModal },
  ] = useDisclosure(false);
  const [order, setOrder] = useState<OrderItem[]>([]);

  const products = productsByClass[userData?.userClass ?? ""] ?? [];

  const normalProductButtons = products
    .filter((element) => !element.id.includes("_"))
    .map((product) => (
      <Button key={product.id} size="xl" onClick={() => handleOrder(product)}>
        {product.name}
      </Button>
    ));

  const hasDiscountProducts =
    products.findIndex((element) => element.id.includes("_")) !== -1;

  const discountProductButtons = products
    .filter((element) => element.id.includes("_"))
    .map((product) => (
      <Button
        key={product.id}
        color="red"
        size="xl"
        onClick={() => handleOrder(product)}
      >
        {product.name}
      </Button>
    ));

  type OrderItem = {
    product: Product;
    count: number;
  };

  async function submitOrder(paidAmount: number, refund?: boolean) {
    const requestParameters = !refund
      ? {
          change: calculateChange(paidAmount, calculateTotalPrice(order)),
          total: calculateTotalPrice(order),
          product: order
            .map((item) => `${item.product.name}:${item.count}個`)
            .join(","),
        }
      : {
          change: 0,
          total: -calculateChange(paidAmount, calculateTotalPrice(order)),
          product: "返金対応",
        };
    api
      ?.addHistory(requestParameters)
      .then((response) => {
        if (response.status == "COMPLETE") {
          notif("DONERECORD");
        } else {
          notif("QUEUE");
        }
      })
      .catch((e) => {
        const error = e as Error;
        notif("ERROR", error);
      });
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

  useEffect(() => {
    api?.flushHistory().then((res) => {
      if (res.status == "COMPLETE") {
        notif("SENT");
      } else if (res.status == "IN-QUEUE") {
        notif("FAILWARN");
      }
    });
  }, [api]);

  return (
    <>
      <Head>
        <title>HFHS REGI SYS</title>
      </Head>
      <AppShell navbar={<Comp_Navbar page="会計" />}>
        <Stack align="center" pb="md" spacing="0">
          <Title order={3}>商品一覧</Title>
          {hasDiscountProducts ? (
            <Tabs w="100%" defaultValue="normal">
              <Tabs.List position="center" grow>
                <Tabs.Tab color="blue" value="normal">
                  <Text>通常</Text>
                </Tabs.Tab>
                <Tabs.Tab color="red" value="discount">
                  <Text>割引済み</Text>
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="normal">
                <Group position="center" p="sm" spacing="xs">
                  {normalProductButtons}
                </Group>
              </Tabs.Panel>
              <Tabs.Panel value="discount">
                <Group position="center" p="sm" spacing="xs">
                  {discountProductButtons}
                </Group>
              </Tabs.Panel>
            </Tabs>
          ) : (
            <Stack spacing="xs">
              <Group position="center" spacing="xs">
                {normalProductButtons}
              </Group>
            </Stack>
          )}
        </Stack>
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
            <Table verticalSpacing="md" striped>
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
                    <td>
                      <Text>{item.product.name}</Text>
                    </td>
                    <td>
                      <Text>¥{item.product.price}</Text>
                    </td>
                    <td>
                      <Text>{item.count}</Text>
                    </td>
                    <td>
                      <Button
                        color="red"
                        variant="outline"
                        onClick={() => deleteItemFromOrder(index)}
                      >
                        削除
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr
                  style={{
                    borderTop: "2px dashed gray",
                    backgroundColor: "white",
                  }}
                >
                  <td>
                    <Text size="lg" weight="bold">
                      合計金額
                    </Text>
                  </td>
                  <td>
                    <Text size="xl" weight="bold">
                      <Mark color={"red"}>{calculateTotalPrice(order)}円</Mark>
                    </Text>
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </Table>
            <Button
              disabled={order.length == 0}
              leftIcon={<IconCoins size="1.2rem" stroke={1.5} />}
              radius="xl"
              size="md"
              color="red"
              styles={{
                root: { paddingRight: rem(14), height: rem(48) },
              }}
              onClick={openPaymentModal}
            >
              支払いへ進む
            </Button>
            <Button
              leftIcon={<IconArrowBigLeftLine size="0.8rem" stroke={1.5} />}
              radius="xl"
              size="sm"
              color="blue"
              styles={{
                root: { paddingRight: rem(14), height: rem(48) },
              }}
              onClick={openRefundModal}
            >
              返金対応
            </Button>
          </Flex>
        </SimpleGrid>
        <PaymentModal
          opened={paymentModalOpened}
          onClose={closePaymentModal}
          orderPrise={calculateTotalPrice(order)}
          onPaymentSubmit={(paidAmount) => {
            closePaymentModal();
            submitOrder(paidAmount);
          }}
        />
        <RefundModal
          opened={refundModalOpened}
          onClose={closeRefundModal}
          onPaymentSubmit={(paidAmount) => {
            closeRefundModal();
            submitOrder(paidAmount, true);
          }}
        />
      </AppShell>
    </>
  );
}
