import { useEffect, useState } from 'react';
import { useInstantSearch, useRefinementList } from 'react-instantsearch';
import { Select, SelectTrigger } from '@/components/ui/select';
import CustomSearchBox from './CutomSearchBox';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CATEGORIES, Category } from '@/lib/traits';

type TraitSelectorProps = {
  category: Category;
  onTraitChange: (trait: string) => void;
  trait: string;
};

const TraitSelector = (props: TraitSelectorProps) => {
  const { category, trait, onTraitChange } = props;

  const [open, setOpen] = useState(false);
  const { items, refine, searchForItems } = useRefinementList({
    attribute: category.key,
    limit: 50, // TODO: Add pagination
    showMoreLimit: 51,
  });

  useEffect(() => {
    if (trait) {
      // Refresh the result when the trait changes
      refine(trait);
    }
  }, [trait, refine]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Select>
          <SelectTrigger
            onClick={() => {
              setOpen(!open);
            }}
            className="w-[180px]"
          >
            {props.trait || 'Choose mint'}
          </SelectTrigger>
        </Select>
      </DialogTrigger>
      <DialogContent className="p-6 w-[350px] rounded-xl">
        <h4 className="mt-4 mb-4 text-md font-medium leading-none">Choose mint</h4>
        <CustomSearchBox search={searchForItems}> </CustomSearchBox>
        <Separator />
        <div className="h-[240px] mt-4 overflow-y-auto">
          {/* TODO: good items first, then everything else */}
          {/* TODO: zora items labeled with [zora]? */}
          {items.map((item, i) => (
            <>
              <div
                key={i}
                className="hover:bg-gray-50 hover:cursor-pointer p-4"
                onClick={() => {
                  onTraitChange(item.label);
                  setOpen(false);
                }}
              >
                {item.label}
              </div>
              <Separator className="" />
            </>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

type RefinementListProps = {
  trait: string;
  setTrait: (trait: string) => void;
};

const RefinementList = (props: RefinementListProps) => {
  const { refresh, setIndexUiState, indexUiState } = useInstantSearch();

  const { trait, setTrait } = props;

  useEffect(() => {
    if (trait) {
      setIndexUiState(() => ({
        refinementList: {
          ['mints.title']: [trait],
        },
      }));
    }
  }, [refresh, setIndexUiState, trait]);

  return (
    <>
      <div className="mt-4">
        <TraitSelector
          category={CATEGORIES[0]}
          trait={trait}
          onTraitChange={setTrait}
        ></TraitSelector>
      </div>
    </>
  );
};

export default RefinementList;
