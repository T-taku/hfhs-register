import { Button, Center, Modal, Stack, Text, createStyles, rem } from "@mantine/core";
import { NumPad } from "./Numpad";
import { IconCoins } from "@tabler/icons-react";
import { useState } from "react";

// 左位置モーダル用
// const useLeftModalStyles = createStyles((theme) => ({
//   inner: {
//     padding: "0",
//     justifyContent: "left"
//   },
//   title: {
//     fontSize: "1.3em"
//   },
//   overlay: {
//     backdropFilter: "grayscale(100%)"
//   },
//   content: {
//     minHeight: "100%"
//   }
// }))

export default function PaymentModal({ opened, orderPrise, onClose, onPaymentSubmit }: { opened: boolean, orderPrise: number, onClose: () => void, onPaymentSubmit: (inputValue: number) => void | unknown }) {
  const [numValue, setNumValue] = useState<number>(0);
  // 左位置モーダル用
  // const leftStyles = useLeftModalStyles();
  return (
    <Modal
      opened={opened}
      onClose={() => { setNumValue(0); onClose() }}
      title={<Text size="lg" weight="bold">合計金額: ¥{orderPrise.toLocaleString()}</Text>}
    // 左位置モーダル用
    // classNames={{ ...leftStyles.classes }}
    // size={310}
    // overlayProps={{
    //   opacity: 0.3,
    // }}
    // transitionProps={{
    //   transition: "slide-right"
    // }}
    >
      <Text size="xl" weight="bold">支払い</Text>
      <NumPad value={numValue} onChange={setNumValue} />
      <Stack p="sm" spacing="sm">
        <Center>
          <Text size="xl">{
            numValue >= orderPrise ? (
              `お釣り: ¥${(numValue - orderPrise).toLocaleString()}`
            ) : (
              "お釣り： -"
            )
          }</Text>
        </Center>
        <Center>
          <Button
            leftIcon={
              <IconCoins size="1.2rem" stroke={1.5} />
            }
            radius="xl"
            size="lg"
            color="green"
            disabled={numValue < orderPrise}
            styles={{
              root: { paddingRight: rem(14), height: rem(48) },
            }}
            onClick={
              () => { onPaymentSubmit(numValue); setNumValue(0); }
            }
          >
            支払いを完了
          </Button>
        </Center>
      </Stack>

    </Modal>
  )
}