import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { EmailQueueType } from "../types/email";

type Store = {
  emailQueue: PaginationType<EmailQueueType> | null;
  setEmailQueue: (data: PaginationType<EmailQueueType>) => void;
};

export const useEmailQueue = create<Store>()((set) => ({
  emailQueue: null,
  setEmailQueue: (data: PaginationType<EmailQueueType>) =>
    set((state) => ({
      emailQueue: data,
    })),
}));
