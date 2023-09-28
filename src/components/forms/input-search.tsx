type Props = {
  q?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  placeholder?: string;
};

export const InputSearch = ({ q, onChange, onClick, placeholder }: Props) => {
  return (
    <div className="flex items-center gap-1">
      <input
        type="text"
        className="rounded-lg border-gray-300"
        onChange={onChange}
        placeholder={placeholder ?? "Cari disini..."}
      />
    </div>
  );
};
