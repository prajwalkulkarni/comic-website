import { useInfiniteQuery } from "react-query";

export interface Characters {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: Data;
}

export interface Data {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Result[];
}

export interface Result {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: Thumbnail;
  resourceURI: string;
  comics: Comics;
  series: Comics;
  stories: Stories;
  events: Comics;
  urls: URL[];
}

export interface Comics {
  available: number;
  collectionURI: string;
  items: ComicsItem[];
  returned: number;
}

export interface ComicsItem {
  resourceURI: string;
  name: string;
}

export interface Stories {
  available: number;
  collectionURI: string;
  items: StoriesItem[];
  returned: number;
}

export interface StoriesItem {
  resourceURI: string;
  name: string;
  type: unknown;
}

export interface Thumbnail {
  path: string;
  extension: Extension;
}
export enum Extension {
  GIF = "gif",
  Jpg = "jpg",
}

const GET_CHARACTERS = `https://gateway.marvel.com:443/v1/public/characters?apikey=${
  import.meta.env.VITE_APP_API_KEY
}`;

export const useGetCharacters = () => {
  const { data, error, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["CHARACTERS"],
      queryFn: async ({ pageParam = 0 }) => {
        const data = await fetch(`${GET_CHARACTERS}&offset=${pageParam}`);

        const response: Characters = await data.json();

        return { ...response.data, prevOffset: pageParam };
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.prevOffset + 20 > lastPage.total) return false;

        return lastPage.prevOffset + 20;
      },
      refetchOnWindowFocus: false,
    });

  const results = data?.pages.reduce((acc: Result[], page) => {
    return [...acc, ...page.results];
  }, []);
  return {
    loading: isLoading,
    isFetching,
    data: results,
    error,
    fetchNextPage,
    hasNextPage,
  };
};
