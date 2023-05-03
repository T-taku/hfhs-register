import { ActionIcon, Center, Group, Title } from "@mantine/core";
import { IconBackspace, IconNumber0, IconNumber1, IconNumber2, IconNumber3, IconNumber4, IconNumber5, IconNumber6, IconNumber7, IconNumber8, IconNumber9 } from "@tabler/icons-react";
import { useRecoilState } from "recoil";
import { amountPaidState } from "../utils/states";

export function NumPad() {
    const [amountPaid, setamountPaid] = useRecoilState(amountPaidState);
    const onNumClick = (n: number) => {
        const newamount = [...amountPaid, n];
        setamountPaid(newamount);
    }
    const onDeleteNum = () => {
        if (amountPaid.length > 0) {
            setamountPaid(amountPaid.slice(0, amountPaid.length - 1));
        }
    };
    return(
        <>
            <Center>
                <Title order={5}>入力 ¥{amountPaid}</Title>
            </Center>
            <Group position="center" spacing="xs">
                <ActionIcon color="lime" size="xl" radius="xl" variant="outline" onClick={() => onNumClick(1)}>
                    <IconNumber1 size="2.125rem" />
                </ActionIcon>
                <ActionIcon color="lime" size="xl" radius="xl" variant="outline" onClick={() => onNumClick(2)}>
                    <IconNumber2 size="2.125rem" />
                </ActionIcon>
                <ActionIcon color="lime" size="xl" radius="xl" variant="outline" onClick={() => onNumClick(3)}>
                    <IconNumber3 size="2.125rem" />
                </ActionIcon>
            </Group>
            <Group position="center" spacing="xs">
                <ActionIcon color="lime" size="xl" radius="xl" variant="outline" onClick={() => onNumClick(4)}>
                    <IconNumber4 size="2.125rem" />
                </ActionIcon>
                <ActionIcon color="lime" size="xl" radius="xl" variant="outline" onClick={() => onNumClick(5)}>
                    <IconNumber5 size="2.125rem" />
                </ActionIcon>
                <ActionIcon color="lime" size="xl" radius="xl" variant="outline" onClick={() => onNumClick(6)}>
                    <IconNumber6 size="2.125rem" />
                </ActionIcon>
            </Group>
            <Group position="center" spacing="xs">
                <ActionIcon color="lime" size="xl" radius="xl" variant="outline" onClick={() => onNumClick(7)}>
                    <IconNumber7 size="2.125rem" />
                </ActionIcon>
                <ActionIcon color="lime" size="xl" radius="xl" variant="outline" onClick={() => onNumClick(8)}>
                    <IconNumber8 size="2.125rem" />
                </ActionIcon>
                <ActionIcon color="lime" size="xl" radius="xl" variant="outline" onClick={() => onNumClick(9)}>
                    <IconNumber9 size="2.125rem" />
                </ActionIcon>
            </Group>
            <Group position="center" spacing="xs">
                <ActionIcon color="lime" size="xl" radius="xl" variant="outline" onClick={() => onNumClick(0)}>
                    <IconNumber0 size="2.125rem" />
                </ActionIcon>
                <ActionIcon color="lime" size="xl" radius="xl" variant="outline" onClick={onDeleteNum}>
                    <IconBackspace size="2.125rem" />
                </ActionIcon>
            </Group>
        </>
    )
}