// /src/types/index.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  order?: number;
}

export interface Channel {
  id: string;
  name: string;
  streamUrl: string;
  logoUrl?: string;
  categorySlug: string;
  epgId?: string;
  country?: string;
}

export type FavoriteChannel = Omit < Channel, 'categorySlug' | 'epgId' | 'country' > & {
  addedAt: number;
};

export type RecentChannel = Omit < Channel, 'categorySlug' | 'epgId' | 'country' > & {
  watchedAt: number;
};
