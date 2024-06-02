import type { History } from '@/utils/RegiAPI';
import { Accordion, Table, Text } from '@mantine/core';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

function formatTimestamp(timestamp: Date | string): string {
  return dayjs(timestamp).format('YYYY年MM月DD日 HH:mm');
}

export default function HistoryTable({ paymentData }: { paymentData: History[] }) {
  // timestampでソートする
  const sortByTimestamp = (data: History[]) => {
    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  const sortedPaymentData = sortByTimestamp(paymentData);

  return (
    <Accordion variant="separated">
      {sortedPaymentData.map((payment) => (
        <Accordion.Item className={payment.paymentId} value={payment.paymentId} key={payment.paymentId}>
          <Accordion.Control>{formatTimestamp(payment.timestamp)}</Accordion.Control>
          <Accordion.Panel>
            <Table maw="100%">
              <thead>
                <tr>
                  <th>購入日時</th>
                  <th>購入商品</th>
                  <th>金額</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{formatTimestamp(payment.timestamp)}</td>
                  <td>{payment.product.split(",").map(t => (
                    <Text key={t} component='p'>
                      {t}
                    </Text>
                  ))}</td>
                  <td>
                    <Text component="p">{payment.total}円</Text>
                    {payment.product !== "返金対応" && <Text component='p'>(支払われた金額:{(payment.total) + (payment.change)}円 お釣り: {payment.change}円)</Text>}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}