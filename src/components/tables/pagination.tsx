import { Button } from "../buttons";

type Props = {
  currentPage: number;
  totalPage: number;
  onNext: () => void;
  onPrevious: () => void;
};

const Pagination = ({ currentPage, totalPage, onNext, onPrevious }: Props) => {
  return (
    <div className="py-2 flex border-t items-center gap-3">
      <div className="flex gap-2 items-center">
        <Button
          className="px-4 text-sm"
          disabled={currentPage === 1 ? true : false}
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button
          disabled={currentPage === totalPage ? true : false}
          onClick={onNext}
          className="px-4 text-sm"
        >
          Next
        </Button>
      </div>

      <div className="text-sm text-gray-700 border-l pl-3">
        Page {currentPage} of {totalPage}
      </div>
    </div>
  );
};

export default Pagination;
