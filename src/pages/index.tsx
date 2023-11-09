import { InstantSearch, InfiniteHits, useInstantSearch } from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import RefinementList from '@/components/RefinementList';
import { useEffect, useState } from 'react';

import axios from 'axios';

import mixpanel from 'mixpanel-browser';
import { Button } from '@/components/ui/button';

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
  const trait = props.trait;

  const _onFarcasterClick = () => {
    mixpanel.track('fc click', { username: hit.username, fid: hit.fid, trait });
  };

  return (
    <Card className="grid grid-cols-8 bg-white p-2">
      <div className="col-span-1">
        <Avatar className="mr-4">
          <AvatarImage src={hit.pfp} alt={hit.username}></AvatarImage>
        </Avatar>
      </div>
      <div className="col-span-5 md:col-span-6 pt-2 ml-1">
        <p className="text-[14px]">{trimDisplayName(hit.displayName)}</p>
      </div>
      <div className="col-span-1">
        <a
          href={`https://warpcast.com/${hit.username}`}
          target="_blank"
          onClick={_onFarcasterClick}
        >
          <Button size={'sm'} className="bg-[#7c65c1]">
            Follow
          </Button>
        </a>
      </div>
    </Card>
  );
}

export default function Home() {
  const [isEmptyQuery, setIsEmptyQuery] = useState(true);

  const [isKittyChecked, setKittyChecked] = useState(false);

  const [kittyData, setKittyData] = useState([]);

  // Trait to search for
  const [trait, setTrait] = useState('');

  useEffect(() => {
    async function getCK2019Data() {
      const { data } = await axios.get('/CryptoKittiesPre2019.json');
      setKittyData(data);
    }

    getCK2019Data().catch(console.error);
  }, []);

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
              <label className="text-xl">Credcaster</label>
            </div>
            <div className="text-right col-span-7">
              <p>Find farcasters by Eth history</p>
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
                setKittyChecked={setKittyChecked}
              />
              <div className="mt-4">
                {isKittyChecked ? (
                  <>
                    {kittyData.map((kittyHit, i) => (
                      <div key={i} className="mt-2">
                        <Hit hit={kittyHit} trait="kitty"></Hit>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {isEmptyQuery ? (
                      <></>
                    ) : (
                      // TODO: may want to conditionally use InfiniteHits only if there isn't a 'special' group selected
                      <InfiniteHits
                        showPrevious={false}
                        hitComponent={({ hit }) => <Hit hit={hit} trait={trait} />}
                        classNames={{
                          item: 'mt-2',
                        }}
                      ></InfiniteHits>
                    )}
                  </>
                )}
              </div>
            </InstantSearch>
          </div>
        </div>
      </main>
    </div>
  );
}
