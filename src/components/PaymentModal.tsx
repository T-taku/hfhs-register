import { Button, Center, Modal, Stack, Text, createStyles, rem } from "@mantine/core";
import { NumPad } from "./Numpad";
import { IconCoins } from "@tabler/icons-react";
import { useState } from "react";

const useModalStyles = createStyles((theme) => ({
  inner: {
    padding: "0",
    justifyContent: "left"
  },
  title: {
    fontSize: "1.3em"
  },
  overlay: {
    backdropFilter: "grayscale(100%)"
  },
  content: {
    minHeight: "100%"
  }
}))

export default function PaymentModal({ opened, orderPrise, onClose, onPaymentSubmit }: { opened: boolean, orderPrise: number, onClose: () => void, onPaymentSubmit: (inputValue: number) => void | unknown }) {
  const [numValue, setNumValue] = useState<number>(0);
  const styles = useModalStyles()
  return (
    <Modal
      size={310}
      classNames={{ ...styles.classes }}
      opened={opened}
      onClose={() => {setNumValue(0); onClose()}}
      title="支払い"
      overlayProps={{
        opacity: 0.3,
      }}
      transitionProps={{
        transition: "slide-right"
      }}
    >
      {/* <Text>合計金額: {numValue}円</Text> */}
      <NumPad value={numValue} onChange={setNumValue} />
      <Stack p="sm" spacing="sm">
        <Center>
          {
            numValue >= orderPrise ? (
              <Text>
                お釣り: {numValue - orderPrise}円
              </Text>
            ) : (
              <Text>お釣り： -</Text>
            )
          }
        </Center>
        <Center>
          <Button
            leftIcon={
              <IconCoins size="1.2rem" stroke={1.5} />
            }
            radius="xl"
            size="md"
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