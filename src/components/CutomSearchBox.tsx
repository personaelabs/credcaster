import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

const CustomSearchBox = (props: any) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    props.search(query);
  }, [props, query]);

  return (
    <Input
      autoFocus={false}
      placeholder={props.placeholder || 'search'}
      onChange={(e) => {
        setQuery(e.target.value);
      }}
      value={query}
      type="text"
    />
  );
};

export default CustomSearchBox;
