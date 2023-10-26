import { useEffect } from "react";
import { useAlert } from "../../stores/alert";
import { Toast } from "flowbite-react";
import {
  HiCheck,
  HiExclamationCircle,
  HiOutlineExclamation,
} from "react-icons/hi";

const Alert = () => {
  const { setMessage, type, message } = useAlert();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage(undefined, undefined);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [message]);

  return (
    <>
      {message !== undefined && type !== undefined && (
        <div className="fixed top-5 right-5 z-50">
          <Toast>
            {type === "success" && (
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-600 text-green-50 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="h-5 w-5" />
              </div>
            )}

            {type === "error" && (
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-800 dark:text-red-200">
                <HiExclamationCircle className="h-5 w-5" />
              </div>
            )}

            {type === "info" && (
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-800 dark:text-blue-200">
                <HiOutlineExclamation className="h-5 w-5" />
              </div>
            )}
            <div className="ml-4 mr-4 text-gray-800 font-normal">{message}</div>
            <Toast.Toggle />
          </Toast>
        </div>
      )}
    </>
  );
};

export default Alert;
