import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { Booking } from "../types/booking";

type Store = {
  booking: PaginationType<Booking> | null;
  setBooking: (data: PaginationType<Booking>) => void;
  detail: Booking | null;
  setDetail: (data: Booking | null) => void;
};

export const useBooking = create<Store>()((set) => ({
  booking: null,
  setBooking: (data: PaginationType<Booking>) =>
    set((state) => ({
      booking: data,
    })),
  detail: null,
  setDetail: (data: Booking | null) =>
    set((state) => ({
      detail: data,
    })),
}));
