type Props = {
  children?: JSX.Element | JSX.Element[] | string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

export const Button = ({
  children,
  className,
  disabled = false,
  onClick,
}: Props) => {
  return (
    <button
      className={`${className} ${
        disabled
          ? "bg-blue-400 text-white cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }  rounded-lg p-2 font-semibold`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
