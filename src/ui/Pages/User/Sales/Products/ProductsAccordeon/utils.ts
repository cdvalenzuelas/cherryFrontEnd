import type { ProductSale, Product } from "@/state";

export const months = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const createPopulateProductSales = (
  sale: ProductSale,
  products: Product[],
) => {
  const populateProductSales2 = sale.sale.map((summary) => {
    const internalProduct = products.filter(
      (product) => product.id === summary.product_id,
    )[0];

    return { ...internalProduct, quantity: summary.quantity };
  });

  return populateProductSales2;
};

export const createKey = (sale: ProductSale): string => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [year, month, ...rest] = sale.created_at.split("-");
  // Crear una llave por periodo
  return `${months[Number(month) - 1]} de ${Number(year)}`;
};
