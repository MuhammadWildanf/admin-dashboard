import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { HiOutlineX } from "react-icons/hi";

type Props = {
  isOpen: boolean;
  close: () => void;
  title?: string | JSX.Element | JSX.Element[];
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  children?: string | JSX.Element | JSX.Element[];
};

const BaseModal = ({ isOpen, close, title, size = "md", children }: Props) => {
  let modalSize = "";

  if (size === "4xl") modalSize = "max-w-4xl";
  if (size === "3xl") modalSize = "max-w-3xl";
  if (size === "2xl") modalSize = "max-w-2xl";
  if (size === "xl") modalSize = "max-w-xl";
  if (size === "lg") modalSize = "max-w-lg";
  if (size === "md") modalSize = "max-w-md";
  if (size === "sm") modalSize = "max-w-sm";

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 " onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full ${modalSize} transform 
                  rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all`}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
                  >
                    {title}
                    {title && (
                      <div onClick={close} className="cursor-pointer">
                        <HiOutlineX />
                      </div>
                    )}
                  </Dialog.Title>
                  <div className="mt-2">{children}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default BaseModal;
