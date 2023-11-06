import { InstantSearch, InfiniteHits } from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import RefinementList from '@/components/RefinementList';
import { useState } from 'react';
import { CATEGORIES, Category } from '@/lib/traits';
import { toIPFSGatewayUrl, toZoraUrl } from '@/lib/utils';

const searchClient = algoliasearch('OBLCAWFSD4', 'bfff463d73b318c23cb6e88f22b255a9');

const trimDisplayName = (displayName: string): string => {
  const trimmed = displayName.substring(0, 20);
  if (trimmed.length < displayName.length) {
    return trimmed + '...';
  }
  return trimmed;
};

type HitProps = {
  hit: any;
  category: Category;
  trait: string;
};

function Hit(props: HitProps) {
  const hit = props.hit;
  const mints = hit.mints;
  const trait = props.trait;

  const matchedMints = mints.filter((mint: any) => mint.title.trimStart().trimEnd() === trait);

  return (
    <Card className="grid grid-cols-10 bg-white p-2">
      {/* 
          1. small avatar image
          2. name
          3. creddd
          4. social link
      */}
      <div className="col-span-1">
        <Avatar className="mr-4">
          <AvatarImage src={hit.pfp} alt={hit.username}></AvatarImage>
        </Avatar>
      </div>
      <div className="col-span-8 pt-2">
        <p className="text-[18px]">{trimDisplayName(hit.displayName)}</p>
      </div>
      {/* <div className="col-span-5">
        {matchedMints.map((mint: any, i: number) => (
          <a href={toZoraUrl(mint.contractAddress, mint.tokenId)} key={i} target="_blank">
            <Image
              width={60}
              height={60}
              src={toIPFSGatewayUrl(mint.image.replace('ipfs://', ''))}
              alt="avatar image"
            ></Image>
          </a>
        ))}
      </div> */}
      <div className="col-span-1 pt-2">
        {' '}
        <a className="items-end" href={`https://warpcast.com/${hit.username}`} target="_blank">
          <Image src="/warpcast.svg" width={30} height={30} alt="warpcast icon"></Image>{' '}
        </a>
      </div>
    </Card>
  );
}

export default function Home() {
  // Category to search for
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);

  // Trait to search for
  const [trait, setTrait] = useState('');

  return (
    <main className="bg-white">
      <div className="p-8">
        <div className="flex justify-center mt-14">
          <label className="text-xl">Mintcaster</label>
        </div>
        <div>
          <p className="text-center mt-4">Find farcasters by Zora mint.</p>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <InstantSearch
            initialUiState={undefined}
            searchClient={searchClient}
            indexName="traitcaster-mints"
          >
            <RefinementList trait={trait} setTrait={setTrait} />
            <div className="mt-4">
              <InfiniteHits
                showPrevious={false}
                hitComponent={({ hit }) => <Hit hit={hit} category={category} trait={trait} />}
                classNames={{
                  item: 'mt-2',
                }}
              ></InfiniteHits>
            </div>
          </InstantSearch>
        </div>
      </div>
    </main>
  );
}
