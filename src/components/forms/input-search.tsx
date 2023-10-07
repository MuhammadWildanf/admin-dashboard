import { useState } from "react";
import { Button } from "../buttons";
import { HiOutlineSearch } from "react-icons/hi";

type Props = {
  q?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (input?: string) => void;
  placeholder?: string;
  withButton?: boolean;
  loadingSubmit?: boolean;
};

export const InputSearch = ({
  q,
  onChange,
  onClick,
  placeholder,
  withButton = false,
  loadingSubmit = false,
}: Props) => {
  const [input, setInput] = useState<string | undefined>(undefined);
  return (
    <>
      {withButton && onClick ? (
        <div className="flex items-center">
          <input
            type="text"
            className="rounded-l-lg border-gray-300"
            placeholder={placeholder ?? "Cari disini..."}
            onChange={(e) => setInput(e.target.value)}
            disabled={loadingSubmit}
          />
          <button
            className={`p-3 text-lg rounded-r-lg ${
              loadingSubmit
                ? "bg-blue-500 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={loadingSubmit}
            onClick={() => onClick(input ?? "")}
          >
            <HiOutlineSearch />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <input
            type="text"
            className="rounded-lg border-gray-300"
            onChange={onChange}
            placeholder={placeholder ?? "Cari disini..."}
          />
        </div>
      )}
    </>
  );
};
