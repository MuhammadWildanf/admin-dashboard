import { Spinner } from "flowbite-react";
import { Button } from "../buttons";
import BaseModal from "./base";

type Props = {
  isOpen: boolean;
  close: () => void;
  subTitle?: string;
  name?: string;
  action?: () => void;
  loading?: boolean;
};

const ModalDeleteConfirmation = ({
  isOpen,
  close,
  subTitle,
  name,
  action,
  loading = false,
}: Props) => {
  return (
    <BaseModal title="Konfirmasi tindakan!" isOpen={isOpen} close={close}>
      <span>
        Apakah anda yakin ingin menghapus {subTitle} <strong>{name}</strong>?
        Aksi ini tidak dapat di kembalikan
      </span>
      <div className="mt-4 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Button onClick={close} variant="danger" className="px-4">
            Batal
          </Button>
          <Button onClick={action} className="px-10">
            {loading ? <Spinner /> : "Iya!"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalDeleteConfirmation;
