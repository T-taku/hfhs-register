import { Product } from "@/utils/product";
import { Button, Group, Stack, Tabs, Text } from "@mantine/core";

export default function ProductButtonList({ products, onAddProduct }: { products: Product[], onAddProduct: (product: Product) => void }) {
  const normalProductButtons = products
    .filter((element) => !element.id.includes("_"))
    .map((product) => (
      <Button key={product.id} size="xl" onClick={() => onAddProduct(product)}>
        {product.name}
      </Button>
    ));

  const hasDiscountProducts =
    products.findIndex((element) => element.id.includes("_")) !== -1;

  const discountProductButtons = products
    .filter((element) => element.id.includes("_"))
    .map((product) => (
      <Button
        key={product.id}
        color="red"
        size="xl"
        onClick={() => onAddProduct(product)}
      >
        {product.name}
      </Button>
    ));

  return hasDiscountProducts ? (
    <Tabs w="100%" defaultValue="normal" >
      <Tabs.List position="center" grow>
        <Tabs.Tab color="blue" value="normal">
          <Text>通常</Text>
        </Tabs.Tab>
        <Tabs.Tab color="red" value="discount">
          <Text>割引</Text>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="normal">
        <Group position="center" p="sm" spacing="xs">
          {normalProductButtons}
        </Group>
      </Tabs.Panel>
      <Tabs.Panel value="discount">
        <Group position="center" p="sm" spacing="xs">
          {discountProductButtons}
        </Group>
      </Tabs.Panel>
    </Tabs>
  ) : (
    <Stack spacing="xs">
      <Group position="center" spacing="xs">
        {normalProductButtons}
      </Group>
    </Stack>
  )
}