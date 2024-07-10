import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { YoutubeType } from "../types/youtube";

type Store = {
  youTubeVideos: PaginationType<YoutubeType> | null;
  setYouTubeVideos: (data: PaginationType<YoutubeType>) => void;
};

export const useYouTube = create<Store>()((set) => ({
  youTubeVideos: null,
  setYouTubeVideos: (data: PaginationType<YoutubeType>) =>
    set((state) => ({
      youTubeVideos: data,
    })),
}));
