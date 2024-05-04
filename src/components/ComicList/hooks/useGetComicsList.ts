import { useQuery } from "react-query";

interface Response {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: Data;
}

interface Data {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Result[];
}

export interface Result {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string | null;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  textObjects: unknown[];
  resourceURI: string;
  urls: URL[];
  series: Series;
  variants: Series[];
  collections: unknown[];
  collectedIssues: Series[];
  dates: DateElement[];
  prices: Price[];
  thumbnail: Thumbnail;
  images: Thumbnail[];
  creators: Creators;
  characters: Characters;
  stories: Stories;
  events: Characters;
}

interface Characters {
  available: number;
  collectionURI: string;
  items: Series[];
  returned: number;
}

interface Series {
  resourceURI: string;
  name: string;
}

interface Creators {
  available: number;
  collectionURI: string;
  items: CreatorsItem[];
  returned: number;
}

interface CreatorsItem {
  resourceURI: string;
  name: string;
  role: string;
}
interface DateElement {
  type: string;
  date: string;
}

interface Thumbnail {
  path: string;
  extension: string;
}

interface Price {
  type: PriceType;
  price: number;
}

enum PriceType {
  DigitalPurchasePrice = "digitalPurchasePrice",
  PrintPrice = "printPrice",
}

interface Stories {
  available: number;
  collectionURI: string;
  items: StoriesItem[];
  returned: number;
}

interface StoriesItem {
  resourceURI: string;
  name: string;
  type: string;
}

const GET_COMICS = `https://gateway.marvel.com:443/v1/public/comics?apikey=${
  import.meta.env.VITE_APP_API_KEY
}`;

export const useGetComicsList = ({
  pageNo = 1,
  title = "",
  characters = {},
}: {
  pageNo: number;
  title?: string;
  characters?: Record<string, string>;
}) => {
  const charactersList =
    Object.keys(characters).length > 0
      ? Object.keys(characters).toString()
      : [].toString();

  const { data, isLoading, isRefetching, error } = useQuery<Response["data"]>({
    queryKey: ["COMICS", pageNo, title, charactersList],
    queryFn: async () => {
      const COMICS_ENDPOINT = `${GET_COMICS}&offset=${(pageNo - 1) * 20}${
        title ? `&titleStartsWith=${title}` : ""
      }${charactersList.length > 0 ? `&characters=${charactersList}` : ""}`;
      const results = await fetch(COMICS_ENDPOINT);
      const data: Response = await results.json();

      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  return {
    data,
    loading: isLoading || isRefetching,
    error,
  };
};
