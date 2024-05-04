import { Input } from "antd";
import { useGetApplicationState } from "../../store/useGetApplicationState";
import { SearchOutlined } from "@ant-design/icons";
import logo from "../../assets/marvel.png";
import { useDebouncedCallback } from "./hooks/useDebouncedCallback";
export const Searchbar = () => {
  const { setSearchTitle } = useGetApplicationState();

  const setSearchTitleDebounced = useDebouncedCallback((value: string) => {
    setSearchTitle(value);
  }, 1000);

  return (
    <div className="bg-[#F0131E] flex justify-between p-4">
      <img src={logo} width={108} />
      <Input
        placeholder="Search for Comics..."
        style={{ width: "fitContent" }}
        onChange={(e) => {
          setSearchTitleDebounced(e.target.value);
        }}
        className="w-full md:w-1/2"
        prefix={<SearchOutlined />}
      />
    </div>
  );
};
