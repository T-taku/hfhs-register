import OrderTable from "@/components/OrderTable";
import PaymentModal from "@/components/PaymentModal";
import ProductButtonList from "@/components/ProductButtonList";
import RefundModal from "@/components/RefundModal";
import { OrderItem } from "@/utils/OrderItem";
import { notif } from "@/utils/notif";
import { useAPI } from "@/utils/useAPI";
import { useUserinfo } from "@/utils/useUserinfo";
import { AppShell, Button, Stack, Title, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBigLeftLine, IconCoins } from "@tabler/icons-react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Comp_Navbar } from "../components/Navbar";
import productsByClass, { Product } from "../utils/product";

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

  const submitOrder = async (paidAmount: number, refund?: boolean) => {
    const requestParameters = !refund
      ? {
        change: paidAmount - totalPrice(order),
        total: totalPrice(order),
        product: order
          .map((item) => `${item.product.name}:${item.count}個`)
          .join(","),
      }
      : {
        change: 0,
        //返金対応は入力金額のみを返金金額とする
        total: -paidAmount,
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

  const addProduct = (product: Product) => {
    const index = order.findIndex((item) => item.product.id === product.id);

    if (index === -1) {
      setOrder((prevOrder) => [...prevOrder, { product, count: 1 }]);
    } else {
      const newOrder = [...order];
      newOrder[index].count++;
      setOrder(newOrder);
    }
  }

  const deleteOrder = (index: number) => {
    setOrder((prevOrder) => {
      const newOrder = [...prevOrder];
      newOrder.splice(index, 1);
      return newOrder;
    });
  }

  const totalPrice = (order: OrderItem[]): number => {
    return order.reduce((pv, cv) => pv + cv.product.price * cv.count, 0);
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
          <ProductButtonList products={products} onAddProduct={addProduct} />
        </Stack>
        <Stack align="center">
          <Title order={3}>購入商品</Title>
          <OrderTable
            order={order}
            totalPrice={totalPrice(order)}
            onDeleteOrder={deleteOrder}
          />
          <Stack spacing="xl">
            <Button
              disabled={order.length == 0}
              leftIcon={<IconCoins size="1.2rem" stroke={1.5} />}
              radius="xl"
              size="lg"
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
              size="md"
              color="blue"
              styles={{
                root: { paddingRight: rem(14), height: rem(48) },
              }}
              onClick={() => {
                //返金対応は入力金額のみを返金金額とする
                //わかりやすくするためにこれまでの選択した商品はなかったことにする
                setOrder([]);
                openRefundModal();
              }}
            >
              返金対応
            </Button>
          </Stack>
        </Stack>
        <PaymentModal
          opened={paymentModalOpened}
          onClose={closePaymentModal}
          orderPrise={totalPrice(order)}
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
