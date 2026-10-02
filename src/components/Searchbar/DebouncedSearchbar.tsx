import { useEffect, useState, type ChangeEvent } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { SearchbarBase } from './SearchbarBase';

export interface DebouncedSearchbarProps {
  className?: string;
  classStyle?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  delay?: number;
  onSearch: (debouncedValue: string) => void;
  onChangeSearch?: (rawValue: string) => void;
}

export const DebouncedSearchbar = ({
  className,
  classStyle,
  placeholder = 'Buscar trabajos, empresas o habilidades',
  value,
  defaultValue = '',
  delay = 350,
  onSearch,
  onChangeSearch,
}: DebouncedSearchbarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>(value ?? defaultValue);

  // Debounced callback that executes search after user stops typing
  const debouncedSearch = useDebounce((query: string) => {
    onSearch(query);
  }, delay);

  // Synchronize if external value changes
  useEffect(() => {
    if (value !== undefined && value !== searchTerm) {
      setSearchTerm(value);
    }
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextVal = event.target.value;
    setSearchTerm(nextVal);
    onChangeSearch?.(nextVal);
    debouncedSearch(nextVal);
  };

  const handleClear = () => {
    debouncedSearch.cancel();
    setSearchTerm('');
    onChangeSearch?.('');
    onSearch('');
  };

  return (
    <SearchbarBase
      className={className || classStyle}
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleChange}
      onClear={handleClear}
    />
  );
};
