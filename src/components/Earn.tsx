import type { History, Setting } from '@/utils/RegiAPI';
import { Card, Progress, Text } from '@mantine/core';
import 'dayjs/locale/ja';

export default function Earn({ paymentData, settingData }: { paymentData: History[], settingData?: Setting }) {

  const totalSum = paymentData.reduce((sum, item) => {
    if (typeof item.total === 'number') {
      return sum + item.total;
    }
    return sum;
  }, 0);

  return (
    <>
      {
        settingData && (
          <>
            <Card withBorder radius="md" padding="xl">
              <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                現在の売り上げ
              </Text>
              <Text fz="lg" fw={500}>
                ¥{totalSum} / ¥{settingData.goal + settingData.reserve}
              </Text>
              <Text>目標金額には、準備金が含まれています。</Text>
              <Progress value={(totalSum / (settingData.goal + settingData.reserve)) * 100} mt="md" size="lg" radius="xl" />
            </Card>
          </>
        )
      }
      {
        !settingData && (
          <>
            <Card withBorder radius="md" padding="xl">
              <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                現在の売り上げ
              </Text>
              <Text fz="lg" fw={500}>
                ¥{totalSum}
              </Text>
              <Text>設定ページにて、設定を保存すると現在の売上が、どのくらい目標金額に近づいているかを確認できます。</Text>
            </Card>
          </>
        )
      }
    </>
  );
}