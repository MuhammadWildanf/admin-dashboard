export type ProductType = {
  id: number;
  name: string;
  sku: string | null;
  module: { id: number | string; name: string };
  product_type: string;
  product_category: string;
  with_screening: boolean;
  screening_module: { id: number | string; name: string };
  base_price: number;
  prices: ProductPriceType[];
};

export type ProductPriceType = {
  id: number;
  product_id: number;
  company: { id: number | string; name: string };
  module: { id: number | string; name: string };
  price: number;
  notes: string | null;
};
