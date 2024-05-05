import { Button, Skeleton, Space, Tooltip } from "antd";
import { Extension, Result, useGetCharacters } from "./hooks/useGetCharacters";
import { useGetApplicationState } from "../../store/useGetApplicationState";
import {
  CheckCircleOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef } from "react";
import {
  Error,
  ProgressiveImageLoading,
  SkeletonLoader,
} from "../../utils/commonComponents";

const loaderData = {
  id: Number.EPSILON,
  name: "Loader",
  description: "",
  modified: "",
  thumbnail: { path: "", extension: Extension.Jpg },
  resourceURI: "",
  comics: { available: 0, collectionURI: "", items: [], returned: 0 },
  series: { available: 0, collectionURI: "", items: [], returned: 0 },
  stories: { available: 0, collectionURI: "", items: [], returned: 0 },
  events: { available: 0, collectionURI: "", items: [], returned: 0 },
  urls: [],
};

export const FilterByCharacters = () => {
  const { data, loading, error, fetchNextPage, hasNextPage, isFetching } =
    useGetCharacters();

  const { setCharacters, characters } = useGetApplicationState();

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  // Intersection Observer to detect when spinner becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage && !isFetching) {
            fetchNextPage();
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of Skeleton is visible
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    //Perform cleanup
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasNextPage, isFetching, fetchNextPage]);

  const scrollAction = useCallback((scrollLeft: boolean) => {
    if (scrollContainer.current) {
      (scrollContainer.current as HTMLDivElement).scrollTo({
        left: scrollLeft
          ? (scrollContainer.current as HTMLDivElement).scrollLeft + 150
          : (scrollContainer.current as HTMLDivElement).scrollLeft - 150,
        behavior: "smooth",
      });
    }
  }, []);

  if (error) {
    return <Error errorMessage="There was an error fetching characters." />;
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <SkeletonLoader skeletoncount={4}>
          <Space>
            <Skeleton.Avatar
              active={true}
              size={100}
              shape={"circle"}
              className="m-2"
            />
          </Space>
        </SkeletonLoader>
      </div>
    );
  }

  //Adding a dummy record corresponding to a loader item
  hasNextPage ? data?.push(loaderData) : null;

  return (
    <div className="flex space-x-1 p-2 items-center justify-center">
      <Button
        icon={<LeftCircleOutlined size={100} />}
        type="primary"
        shape="circle"
        onClick={() => scrollAction(false)}
      />
      <div
        className="flex flex-no-wrap w-full overflow-x-scroll no-scrollbar"
        ref={scrollContainer}
      >
        {data?.map((character, index) => {
          //If the current character is the last character(dummy iem), render loader skeleton
          if (index === data.length - 1 && hasNextPage) {
            return (
              <div ref={loaderRef} key={character.id}>
                <Skeleton.Avatar shape="circle" active size={100} />
              </div>
            );
          }

          if (!hasNextPage) {
            return <p>End of List</p>;
          }

          return (
            <Character
              character={character}
              key={character.id}
              setCharacters={setCharacters}
              isChecked={Object.keys(characters).includes(
                character.id.toString()
              )}
            />
          );
        })}
      </div>
      <Button
        icon={<RightCircleOutlined size={100} />}
        type="primary"
        shape="circle"
        onClick={() => scrollAction(true)}
      />
    </div>
  );
};

const Character = ({
  character,
  setCharacters,
  isChecked = false,
}: {
  character: Result;
  setCharacters: (charactedId: number, characterName: string) => void;
  isChecked: boolean;
}) => {
  return (
    <div className="flex-shrink-0 mx-2 basis-2/6 sm:basis-1/4 md:basis-1/12  mx-2">
      <Tooltip title={character.name}>
        <div
          onClick={() => setCharacters(character.id, character.name)}
          className="w-fit hover:cursor-pointer relative"
        >
          <ProgressiveImageLoading
            src={character.thumbnail.path + "." + character.thumbnail.extension}
            style={{ width: 100 }}
            className="rounded-full border-2 bg-cover border-black object-cover overflow-hidden aspect-square"
          />

          {isChecked && (
            <CheckCircleOutlined
              style={{ fontSize: "100px" }}
              className="absolute top-0 left-0 w-full h-full"
            />
          )}
        </div>
      </Tooltip>
    </div>
  );
};
