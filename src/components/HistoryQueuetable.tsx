import type { AddHistoryRequest } from '@/utils/RegiAPI';
import { Accordion, Table, createStyles, rem } from '@mantine/core';

export default function HistoryQueueTable({ paymentData }: { paymentData: AddHistoryRequest[] }) {
  return (
    <>
      <Accordion variant="separated">
        {paymentData.map((payment, index) => (
          <Table miw={700} key={index}>
            <thead>
              <tr>
                <th>購入商品</th>
                <th>金額</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{payment.product}</td>
                <td><p>{payment.total}円</p><p>(支払われた金額:{(payment.total) + (payment.change)}円 お釣り: {payment.change}円)</p></td>
              </tr>
            </tbody>
          </Table>
        ))}
      </Accordion>
    </>
  );
}