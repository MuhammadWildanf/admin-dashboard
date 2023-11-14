type Props = {
  children?: JSX.Element | JSX.Element[] | string;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
  variant?: "primary" | "danger" | "info";
};

export const Button = ({
  children,
  className,
  disabled = false,
  onClick,
  type = "button",
  variant = "primary",
}: Props) => {
  return (
    <button
      type={type}
      className={`${className} ${
        disabled && "bg-gray-500 text-white cursor-not-allowed"
      } ${
        variant === "primary" && "bg-blue-600 hover:bg-blue-700 text-white"
      } ${variant === "danger" && "bg-red-600 hover:bg-red-700 text-white"}  ${
        variant === "info" && "bg-purple-600 hover:bg-purple-700 text-white"
      } rounded-lg p-2 font-semibold`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
