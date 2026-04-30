export const artworkStatuses = ["available", "sold", "reserved"] as const;
export const artworkCurrencies = ["EUR", "USD", "RUB"] as const;

export type ArtworkStatus = (typeof artworkStatuses)[number];
export type ArtworkCurrency = (typeof artworkCurrencies)[number];

export type ArtworkImage = {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  width?: number;
  height?: number;
  sortOrder?: number;
  isPrimary?: boolean;
};

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  collection?: string | null;
  collectionId?: string | null;
  year?: number | null;
  medium?: string | null;
  width?: number | null;
  height?: number | null;
  price?: number | null;
  currency?: ArtworkCurrency | null;
  status: ArtworkStatus;
  description?: string | null;
  images: ArtworkImage[];
  featured: boolean;
  hero: boolean;
  sortOrder: number;
  showPrice: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type ArtworkInsert = Omit<Artwork, "id"> & {
  id?: string;
};

export type ArtworkUpdate = Partial<Omit<Artwork, "id">>;

export type ArtworkRow = {
  id: string;
  slug: string;
  title: string;
  collectionId: string | null;
  collection: string | null;
  year: number | null;
  medium: string | null;
  width: number | null;
  height: number | null;
  price: number | null;
  currency: ArtworkCurrency | null;
  status: ArtworkStatus;
  description: string | null;
  images: ArtworkImage[];
  featured: boolean;
  hero: boolean;
  sortOrder: number;
  showPrice: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type ArtworkCollection = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverArtworkId: string | null;
  sortOrder: number;
  featured: boolean;
};

export type ArtworkCollectionWithArtworks = ArtworkCollection & {
  artworks: Artwork[];
};
