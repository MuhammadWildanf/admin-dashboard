import { create } from "zustand";
import { PaginationType } from "../../types/pagination";
import { ClientType } from "../../types/client";

type Store = {
  clients: PaginationType<ClientType> | null;
  setClients: (data: PaginationType<ClientType>) => void;
  client: ClientType | null;
  setClient: (data: ClientType | null) => void;
};

export const useClient = create<Store>()((set) => ({
  clients: null,
  setClients: (data: PaginationType<ClientType>) =>
    set((state) => ({
      clients: data,
    })),
  client: null,
  setClient: (data: ClientType | null) =>
    set((state) => ({
      client: data,
    })),
}));
