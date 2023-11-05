import { InstantSearch, InfiniteHits } from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import RefinementList from '@/components/RefinementList';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-8 flex-row justify-between">
          <div className="flex items-center">
            <Avatar className="mr-4">
              <AvatarImage src={hit.pfp} alt={hit.username}></AvatarImage>
            </Avatar>
            <p className="text-[18px]">{trimDisplayName(hit.displayName)}</p>
          </div>
          <div className="w-1/5 flex justify-end">
            <a href={`https://warpcast.com/${hit.username}`} target="_blank">
              <Image src="/warpcast.svg" width={30} height={30} alt="warpcast icon"></Image>
            </a>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="p-4 grid grid-cols-3 gap-4">
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
          </div>
          <Separator></Separator>
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-8">
        <p className="mt-4 text-slate-900 text-opacity-70">{hit.bio}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  // Category to search for
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);

  // Trait to search for
  const [trait, setTrait] = useState('');

  return (
    <main className="bg-[#EFEBEB]">
      <div className="p-8">
        <div className="flex justify-center mt-14">
          <p className="text-indigo-500 text-3xl font-bold font-['Inter']">Traitcaster</p>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <InstantSearch
            initialUiState={undefined}
            searchClient={searchClient}
            indexName="traitcaster-mints"
          >
            <RefinementList
              category={category}
              setCategory={setCategory}
              trait={trait}
              setTrait={setTrait}
            />
            <div className="mt-4 w-[350px] md:w-[450px]">
              <InfiniteHits
                showPrevious={false}
                hitComponent={({ hit }) => <Hit hit={hit} category={category} trait={trait} />}
                classNames={{
                  item: 'mt-4 ',
                }}
              ></InfiniteHits>
            </div>
          </InstantSearch>
        </div>
      </div>
    </main>
  );
}
