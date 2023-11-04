import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const toIPFSGatewayUrl = (cid: string): string =>
  `https://personae.infura-ipfs.io/ipfs/${cid}`;

export const toZoraUrl = (contractAddress: string, tokenId: string): string =>
  `https://zora.co/collect/zora:${contractAddress}/${tokenId}`;
