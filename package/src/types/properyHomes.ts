// types/properyHomes.ts
// No changes needed for performance — type is fine as-is.
// Added `description` field which is used in ProductsClient but was missing from the type.

export type StockStatus = 'In Stock' | 'Available in 5-7 Days' | 'Out of Stock';

export interface PropertyHomes {
  name:        string;
  rate:        number;
  slug:        string;

  // image support — API returns { src: string }[]
  images: (
    | string
    | { src?: string }
  )[];

  // features
  features:    string[];

  // optional fields
  description?: string;   // ← was missing, caused type errors in ProductsClient
  category?:    string;
  warranty?:    string;
  capacity?:    string;
  suitableFor?: string;

  // badges
  rating?:       number;
  isBestSeller?: boolean;
  isNew?:        boolean;

  // stock
  stockStatus?:  StockStatus;
}