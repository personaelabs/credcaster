import { InstantSearch, InfiniteHits, useInstantSearch } from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import RefinementList from '@/components/RefinementList';
import { useEffect, useState } from 'react';

import mixpanel from 'mixpanel-browser';

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
  trait: string;
};

function Hit(props: HitProps) {
  const hit = props.hit;
  const mints = hit.mints;
  const trait = props.trait;

  const matchedMints = mints.filter((mint: any) => mint.title.trimStart().trimEnd() === trait);

  const _onFarcasterClick = () => {
    mixpanel.track('fc click', { username: hit.username, fid: hit.fid, trait });
  };

  return (
    <Card className="grid grid-cols-10 bg-white p-2">
      <div className="col-span-2 sm:col-span-1">
        <Avatar className="mr-4">
          <AvatarImage src={hit.pfp} alt={hit.username}></AvatarImage>
        </Avatar>
      </div>
      <div className="col-span-7 sm:col-span-8 pt-2 ml-1">
        <p className="text-[14px]">{trimDisplayName(hit.displayName)}</p>
      </div>
      <div className="col-span-1 pt-2">
        <a
          onClick={_onFarcasterClick}
          className="items-end"
          href={`https://warpcast.com/${hit.username}`}
          target="_blank"
        >
          <Image src="/warpcast.svg" width={30} height={30} alt="warpcast icon"></Image>{' '}
        </a>
      </div>
    </Card>
  );
}

export default function Home() {
  const [isEmptyQuery, setIsEmptyQuery] = useState(true);

  // Trait to search for
  const [trait, setTrait] = useState('');

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      console.log('init mixpanel');
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
        debug: true,
        track_pageview: true,
        persistence: 'localStorage',
      });
    }
  }, []);

  return (
    <div className="mb-4 flex min-h-screen w-full justify-center bg-gray-50">
      <main className="bg-white w-[550px] md:w-[650px]">
        <div className="p-8">
          <div className="grid grid-cols-10">
            <div className="col-span-3">
              <label className="text-xl">Mintcaster</label>
            </div>
            <div className="text-right col-span-7">
              <p>Find farcasters by Zora mint.</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col ">
            <InstantSearch
              initialUiState={undefined}
              searchClient={searchClient}
              indexName="traitcaster-mints"
            >
              <RefinementList
                mixpanel={mixpanel}
                trait={trait}
                setTrait={setTrait}
                setIsEmptyQuery={setIsEmptyQuery}
              />
              <div className="mt-4">
                {isEmptyQuery ? (
                  <></>
                ) : (
                  <InfiniteHits
                    showPrevious={false}
                    hitComponent={({ hit }) => <Hit hit={hit} trait={trait} />}
                    classNames={{
                      item: 'mt-2',
                    }}
                  ></InfiniteHits>
                )}
              </div>
            </InstantSearch>
          </div>
        </div>
      </main>
    </div>
  );
}
