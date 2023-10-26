import { request } from "./config";

export const getData = async (
  url: string,
  page?: number,
  q?: string,
  searchMode: boolean = false
) => {
  // setLoading(true);
  try {
    if (page || q) {
      let params = {
        q: q ?? "",
        page: searchMode ? 1 : page ?? 1,
        with_paginate: 1,
      };
      const { data } = await request.get(url, {
        params: params,
      });
      return data.data;
    }
    const { data } = await request.get(url);
    return data.data;
  } catch (err: any) {
    if (err.response.status === 404) {
      window.location.href = "/not-found";
    }
    console.log(err);
  }
};
