import { OrderItem } from "@/utils/OrderItem";
import { Button, Mark, Table, Text } from "@mantine/core";

export default function OrderTable({ order, totalPrice, onDeleteOrder }: { order: OrderItem[], totalPrice: number, onDeleteOrder: (orderItemIndex: number) => void }) {
  return (<Table verticalSpacing="md" striped>
    <thead>
      <tr>
        <th>
          <Text size="lg">商品</Text>
        </th>
        <th>
          <Text size="lg">値段</Text>
        </th>
        <th>
          <Text size="lg">個数</Text>
        </th>
        <th>
          <Text size="lg">操作</Text>
        </th>
      </tr>
    </thead>
    <tbody>
      {order.map((item, index) => (
        <tr key={index}>
          <td>
            <Text size="lg">{item.product.name}</Text>
          </td>
          <td>
            <Text size="lg">¥{item.product.price}</Text>
          </td>
          <td>
            <Text size="lg">{item.count}</Text>
          </td>
          <td>
            <Button
              color="red"
              variant="outline"
              onClick={() => onDeleteOrder(index)}
            >
              削除
            </Button>
          </td>
        </tr>
      ))}
      <tr
        style={{
          borderTop: "2px dashed gray",
          backgroundColor: "white",
        }}
      >
        <td>
          <Text size="lg" weight="bold">
            合計金額
          </Text>
        </td>
        <td>
          <Text size="xl" weight="bold">
            <Mark color="red">¥{totalPrice}</Mark>
          </Text>
        </td>
        <td>
          <Text>{order.length > 0 && `(${order.length})`}</Text>
        </td>
        <td></td>
      </tr>
    </tbody>
  </Table>)
}