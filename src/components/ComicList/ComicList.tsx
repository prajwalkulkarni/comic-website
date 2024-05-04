import { Button, Card, Col, Pagination, Row, Skeleton } from "antd";
import { Result, useGetComicsList } from "./hooks/useGetComicsList";
import { useGetApplicationState } from "../../store/useGetApplicationState";
import {
  Error,
  ProgressiveImageLoading,
  SkeletonLoader,
} from "../../utils/commonComponents";
import { SearchOutlined } from "@ant-design/icons";

export const ComicList = () => {
  const { setPageNumber, pageNo, title, characters, clearFilters } =
    useGetApplicationState();

  const { data, loading, error } = useGetComicsList({
    pageNo,
    title,
    characters,
  });

  const characterNames = Object.values(characters);

  if (error) {
    return <Error errorMessage={"There was an error fetching Comics."} />;
  }

  if (loading) {
    return (
      <div className="overflow-hidden">
        <Row gutter={[16, 16]} className="flex justify-center" wrap>
          <SkeletonLoader skeletoncount={4}>
            <Col>
              <Card style={{ width: 200 }}>
                <Skeleton paragraph={{ rows: 6 }} active />
              </Card>
            </Col>
          </SkeletonLoader>
        </Row>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-2">
      {characterNames.length > 0 ? (
        <div className="flex flex-wrap justify-between px-16 w-full">
          <p className="text-md font-bold">
            Explore - {characterNames.join(", ")}
          </p>

          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      ) : null}

      {title ? (
        <div className="flex w-full px-16">
          <p className="text-lg font-bold">Search Results for - {title}</p>
        </div>
      ) : null}
      <div className="flex flex-wrap justify-center">
        {data?.results.length === 0 ? (
          <p className="text-lg font-bold">
            <SearchOutlined /> No Results found :(
          </p>
        ) : null}
        {data?.results.map((comic) => {
          return <Comic comic={comic} key={comic.id} />;
        })}
      </div>
      <Pagination
        total={data?.total}
        showSizeChanger={false}
        pageSize={20}
        onChange={setPageNumber}
        current={pageNo}
      />
    </div>
  );
};

const Comic = ({ comic }: { comic: Result }) => {
  return (
    <div
      style={{ width: "240px" }}
      className="m-2 relative flex flex-wrap overflow-hidden group p-0 rounded-md"
    >
      <figure className="relative flex flex-wrap w-100">
        <ProgressiveImageLoading
          src={
            comic.images.length > 0
              ? `${comic.images[0]?.path}.${comic.images[0]?.extension}`
              : `http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg`
          }
          className="object-cover object-center overflow-hidden transition duration-500 transform w-100 h-full hover:scale-150"
        />
      </figure>

      <div className="absolute bottom-0 left-0 z-10 w-full transition duration-500 translate-y-full bg-white group-hover:translate-y-0">
        <p className="px-3 text-xl font-bold text-black text-ellipsis">
          {comic.title}
        </p>
      </div>
    </div>
  );
};

export default ComicList;
