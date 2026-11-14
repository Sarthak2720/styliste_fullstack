export const PRODUCT_SLUGS: Record<number, string> = {
  5: 'navy-blue-embellished-evening-gown',
  4: 'royal-purple-embroidered-anarkali-gown',
  3: 'yellow-silk-saree',
};

export const REVERSE_PRODUCT_SLUGS: Record<string, number> = {
  'navy-blue-embellished-evening-gown': 5,
  'royal-purple-embroidered-anarkali-gown': 4,
  'yellow-silk-saree': 3,
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getProductSlug = (product: { id: number; name?: string }): string => {
  if (PRODUCT_SLUGS[product.id]) {
    return PRODUCT_SLUGS[product.id];
  }
  return product.name ? slugify(product.name) : String(product.id);
};

export const getProductPath = (product: { id: number; name?: string } | number | string): string => {
  if (typeof product === 'object' && product !== null) {
    return `/products/${getProductSlug(product)}`;
  }
  const numId = Number(product);
  if (!isNaN(numId) && PRODUCT_SLUGS[numId]) {
    return `/products/${PRODUCT_SLUGS[numId]}`;
  }
  return `/products/${product}`;
};
