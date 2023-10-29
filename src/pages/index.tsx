import { InstantSearch, Highlight, useSearchBox, InfiniteHits } from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import warpcastIcon from '../components/warpcastIcon.svg';
import Image from 'next/image';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const searchClient = algoliasearch('OBLCAWFSD4', 'bfff463d73b318c23cb6e88f22b255a9');

const trimUsername = (username: string): string => {
  const trimed = username.substring(0, 20);
  if (trimed.length < username.length) {
    return trimed + '...';
  }
  return trimed;
};

function Hit(props: any) {
  const hit = props.hit;

  const matchedTraits = props.hit._highlightResult?.traits.filter(
    (trait: any) => trait.matchLevel !== 'none',
  );
  hit._highlightResult.traits = matchedTraits;

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
              <Image src={warpcastIcon} alt="warpcast icon"></Image>
            </a>
          </div>
        </CardTitle>
        <CardDescription>
          <Highlight hit={hit} attribute="traits" />
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

const CustomSearchBox = (props: any) => {
  const { query, refine, clear } = useSearchBox(props);

  return (
    <Input
      placeholder="Search a trait (e.g. Farcaster OG)"
      onChange={(e) => {
        refine(e.target.value);
      }}
      value={query}
      type="text"
    />
  );
};

export default function Home() {
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
            indexName="traitcaster"
          >
            <div className="mt-4 w-[300px] md:w-[600px]">
              <CustomSearchBox></CustomSearchBox>
            </div>
            <div className="mt-4 w-[350px] md:w-[450px]">
              <InfiniteHits
                showPrevious={false}
                hitComponent={Hit}
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
