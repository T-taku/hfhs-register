import { Button, Center, Modal, Text, rem } from "@mantine/core";
import { NumPad } from "./Numpad";
import { IconCoins } from "@tabler/icons-react";
import { useState } from "react";

export default function RefundModal({ opened, onClose, onPaymentSubmit }: { opened: boolean, onClose: () => void, onPaymentSubmit: (inputValue: number) => void | unknown }) {
  const [numValue, setNumValue] = useState<number>(0);
  return (
    <Modal opened={opened} onClose={() => {setNumValue(0); onClose();}} title="返金">
      <NumPad refund onChange={setNumValue} value={numValue} />
      <Center p="md">
        <Button
          leftIcon={
            <IconCoins size="1.2rem" stroke={1.5} />
          }
          radius="xl"
          size="md"
          color="blue"
          styles={{
            root: { paddingRight: rem(14), height: rem(48) },
          }}
          onClick={
            () => { onPaymentSubmit(numValue); setNumValue(0); }
          }
        >
          返金を完了
        </Button>
      </Center>
    </Modal>
  )
}