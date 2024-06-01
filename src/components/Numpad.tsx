import { ActionIcon, Center, SimpleGrid, Text } from "@mantine/core";
import { IconBackspace, IconNumber0, IconNumber1, IconNumber2, IconNumber3, IconNumber4, IconNumber5, IconNumber6, IconNumber7, IconNumber8, IconNumber9 } from "@tabler/icons-react";

export function NumPad({ refund = false, value = 0, onChange }: { refund?: boolean, value?: number, onChange: (newValue: number) => void }) {
  const amountPaid = value.toString().split("").map(s => parseInt(s));
  const colorScheme = refund ? "blue" : "lime";
  const onNumClick = (n: number) => {
    if(amountPaid.length <= 1 && amountPaid[0] === 0) {
      updateNum([n]);
    } else {
      const newamount = [...amountPaid, n];
      updateNum(newamount);
    }
  }
  const onDeleteNum = () => {
    if (amountPaid.length > 0) {
      const newamount = amountPaid.slice(0, amountPaid.length - 1)
      if(newamount.length == 0) {
        updateNum([0])
      } else {
        updateNum(newamount);
      }
    }
  };
  const updateNum = (newamount: number[]) => {
    onChange(parseInt(newamount.join(""), 10))
  }
  const buttons = [
    [1, IconNumber1],
    [2, IconNumber2],
    [3, IconNumber3],
    [4, IconNumber4],
    [5, IconNumber5],
    [6, IconNumber6],
    [7, IconNumber7],
    [8, IconNumber8],
    [9, IconNumber9],
    undefined,
    [0, IconNumber0],
    ["backspace", IconBackspace]
  ] as const;
  return (
    <>
      <Center>
        <Text size="5em">¥{parseInt(amountPaid.join(""), 10).toLocaleString()}</Text>
      </Center>
      <Center>
      <SimpleGrid cols={3} spacing="sm" verticalSpacing="sm">
        {buttons.map(Item => {
          if (Item) {
            const [number, Icon] = Item;
            return (
              <ActionIcon
                key={Item[0]}
                color={colorScheme}
                size="4em"
                radius="4em"
                variant="outline"
                onClick={
                  number == "backspace" ?
                    () => onDeleteNum() :
                    () => { onNumClick(number) }
                }
              >
                <Icon size="3.5em" />
              </ActionIcon>
            )
          } else {
            return (<div key="blank"></div>)
          }
        })}
      </SimpleGrid>
      </Center>
    </>
  )
}