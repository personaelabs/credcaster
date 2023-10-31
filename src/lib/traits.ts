export type Category = {
  key: string;
  label: string;
};

export const CATEGORIES = [
  {
    key: 'nfts.collection',
    label: 'NFTs',
  },
  {
    key: 'usedChains',
    label: 'L2s',
  },
];

export type ChainMeta = {
  name: string;
  logo: string;
};

export const CHAIN_META: { [key: string]: ChainMeta } = {
  polygon: {
    name: 'Polygon',
    logo: '/polygon.svg',
  },
  gnosis: {
    name: 'Gnosis',
    logo: '/gnosis.svg',
  },
  // TODO: Add more chains
};
