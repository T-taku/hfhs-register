import { type ResponseHistory } from '@/utils/openapi';
import { Accordion, Table, createStyles, rem } from '@mantine/core';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

function formatTimestamp(timestamp: string): string {
  return dayjs(timestamp).format('YYYY年MM月DD日 HH:mm');
}

export default function Historytable({ paymentData }: { paymentData: ResponseHistory[] }) {
  // timestampでソートするヘルパー関数
  function sortByTimestamp(data) {
    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // テーブルに表示するデータを取得
  const sortedData = sortByTimestamp(paymentData);
  const useStyles = createStyles((theme) => ({
    wrapper: {
      paddingTop: `calc(${theme.spacing.xl} * 2)`,
      paddingBottom: `calc(${theme.spacing.xl} * 2)`,
      minHeight: 650,
    },

    title: {
      marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    },

    item: {
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.lg,
      border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
    },
  }));

  return (
    <>
      <Accordion variant="separated">
        {sortedData.map((payment) => (
          <Accordion.Item className={payment.paymentId} value={payment.paymentId} key={payment.paymentId}>
            <Accordion.Control>{formatTimestamp(payment.timestamp)}</Accordion.Control>
            <Accordion.Panel>
              <Table miw={700}>
                <thead className="tekitou">
                  <tr>
                    <th>購入日時</th>
                    <th>購入商品</th>
                    <th>金額</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={payment.paymentId}>
                    <td>{formatTimestamp(payment.timestamp)}</td>
                    <td>{payment.product}</td>
                    <td>{payment.total}円(支払われた金額:{(payment.total) + (payment.change)}円 お釣り: {payment.change}円)</td>
                  </tr>
                </tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}