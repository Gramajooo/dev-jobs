import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { SearchbarBase } from "./SearchbarBase";

export interface SearchbarProps {
  classStyle?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChangeSearch?: (value: string) => void;
  onSearch?: (value: string) => void;
  isEnabledButton?: boolean;
  buttonText?: string;
}

export const Searchbar = ({
  isEnabledButton = true,
  classStyle,
  className,
  placeholder,
  value,
  defaultValue = "",
  onChangeSearch,
  onSearch,
  buttonText = "Buscar",
}: SearchbarProps) => {
  const [internalValue, setInternalValue] = useState<string>(
    value ?? defaultValue,
  );

  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.value;
    if (value === undefined) {
      setInternalValue(newVal);
    }
    onChangeSearch?.(newVal);
  };

  const handleClear = () => {
    if (value === undefined) {
      setInternalValue("");
    }
    onChangeSearch?.("");
  };

  const handleSearchClick = () => {
    onSearch?.(currentValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch?.(currentValue);
    }
  };

  return (
    <SearchbarBase
      className={className || classStyle}
      placeholder={placeholder}
      value={currentValue}
      onChange={handleChange}
      onClear={handleClear}
      onKeyDown={handleKeyDown}
    >
      {isEnabledButton && (
        <button
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg py-2.5 px-6 text-base font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer shadow-md shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          type="button"
          onClick={handleSearchClick}
        >
          {buttonText}
        </button>
      )}
    </SearchbarBase>
  );
};
