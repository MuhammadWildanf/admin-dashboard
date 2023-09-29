import { HiOutlinePlus } from "react-icons/hi";

type Props = {
  onClick?: () => void;
};

const AddButton = ({ onClick }: Props) => {
  return (
    <div className="fixed bottom-10 right-10">
      <button
        className={`px-6 h-12 bg-blue-700 shadow-lg text-white hover:bg-blue-800 rounded-full flex justify-center items-center`}
        onClick={onClick}
        type="button"
      >
        <div className="flex gap-2">
          <HiOutlinePlus className="text-2xl" /> <span>Tambah</span>
        </div>
      </button>
    </div>
  );
};

export default AddButton;
