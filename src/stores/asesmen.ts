import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { AsesmentParticipantType, AsesmentType } from "../types/asesmen";

type Store = {
  asesmens: PaginationType<AsesmentType> | null;
  setAsesmens: (data: PaginationType<AsesmentType>) => void;
  asesmen: AsesmentType | null;
  setAsesmen: (data: AsesmentType | null) => void;
  participants: PaginationType<AsesmentParticipantType> | null;
  setParticipants: (data: PaginationType<AsesmentParticipantType>) => void;
};

export const useAsesmen = create<Store>()((set) => ({
  asesmens: null,
  setAsesmens: (data: PaginationType<AsesmentType>) =>
    set((state) => ({
      asesmens: data,
    })),
  asesmen: null,
  setAsesmen: (data: AsesmentType | null) =>
    set((state) => ({
      asesmen: data,
    })),
  participants: null,
  setParticipants: (data: PaginationType<AsesmentParticipantType>) =>
    set((state) => ({
      participants: data,
    })),
}));
