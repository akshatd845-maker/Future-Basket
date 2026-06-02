export const STORAGE_KEY = "ecommerce_cart_v1";

export const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

export const normalizeProductForCart = (product) => {
  // Defensive against missing product fields.
  return {
    _id: product?._id ?? product?.id,
    title: product?.title ?? "",
    price: Number(product?.price ?? 0),
    image: product?.image ?? "",
    category: product?.category ?? "",
    description: product?.description ?? "",
  };
};

export function restoreInitialCart() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  const parsed = safeParse(raw);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((x) => x && x.productId)
    .map((x) => ({
      productId: x.productId,
      quantity: Number(x.quantity ?? 1),
      product: x.product,
    }))
    .filter((x) => Number.isFinite(x.quantity) && x.quantity > 0);
}

