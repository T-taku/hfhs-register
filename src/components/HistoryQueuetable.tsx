import type { AddHistoryRequest } from "@/utils/RegiAPI";
import { Accordion, Table, Text } from "@mantine/core";

export default function HistoryQueueTable({
  paymentData,
}: {
  paymentData: AddHistoryRequest[];
}) {
  return paymentData.map((payment, index) => (
    <Table miw={700} key={index}>
      <thead>
        <tr>
          <th>購入商品</th>
          <th>金額</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {payment.product.split(",").map((t) => (
              <Text component="p">{t}</Text>
            ))}
          </td>
          <td>
            <Text component="p">{payment.total}円</Text>
            {payment.product !== "返金対応" && (
              <Text component="p">
                (支払われた金額:{payment.total + payment.change}円 お釣り:{" "}
                {payment.change}円)
              </Text>
            )}
          </td>
        </tr>
      </tbody>
    </Table>
  ))
    ;
}
