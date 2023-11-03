import { InstantSearch, InfiniteHits } from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import RefinementList from '@/components/RefinementList';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { CATEGORIES, CHAIN_META, Category } from '@/lib/traits';

const searchClient = algoliasearch('OBLCAWFSD4', 'bfff463d73b318c23cb6e88f22b255a9');

const trimUsername = (username: string): string => {
  const trimed = username.substring(0, 20);
  if (trimed.length < username.length) {
    return trimed + '...';
  }
  return trimed;
};

type HitProps = {
  hit: any;
  category: Category;
  trait: string;
};

function Hit(props: HitProps) {
  const hit = props.hit;
  const category = props.category;
  const trait = props.trait;

  const matchedNFTs = hit.nfts.filter((nft: any) => nft.collection === trait);
  const matchedChains = hit.usedChains.filter((chain: string) => chain === trait);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-8 flex-row justify-between">
          <div className="flex items-center">
            <Avatar className="mr-4">
              <AvatarImage src={hit.pfp} alt={hit.username}></AvatarImage>
            </Avatar>
            <p className="text-[18px]">{trimUsername(hit.username)}</p>
          </div>
          <div className="w-1/5 flex justify-end">
            <a href={`https://warpcast.com/${hit.username}`} target="_blank">
              <Image src="/warpcast.svg" width={30} height={30} alt="warpcast icon"></Image>
            </a>
          </div>
        </CardTitle>
        <CardDescription>
          {category.key === 'nfts.collection' && (
            <div>
              <p>{trait}</p>
              <div className="grid grid-cols-6">
                {matchedNFTs.map((nft: any, i: number) => (
                  <div key={i} className="py-2">
                    <Avatar>
                      <AvatarImage
                        src={nft.media}
                        alt={nft.name}
                        className="w-12 object-cover"
                      ></AvatarImage>
                    </Avatar>
                  </div>
                ))}
              </div>
            </div>
          )}
          {category.key === 'usedChains' && (
            <div>
              {matchedChains.map((chain: any, i: number) => (
                <div key={i} className="flex py-4 flex-row gap-2">
                  <Image src={CHAIN_META[chain].logo} width={20} height={20} alt={chain} />
                  <span>{CHAIN_META[chain].name} user</span>
                </div>
              ))}
            </div>
          )}

          <Separator></Separator>
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-8">
        <p>
          <b> 10,000 </b>followers
        </p>
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
    <main>
      <div className="flex justify-center mt-14">
        <p className="text-3xl font-bold font-['Inter']">CredddCast</p>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <InstantSearch
          initialUiState={undefined}
          searchClient={searchClient}
          indexName="traitcaster"
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
    </main>
  );
}
