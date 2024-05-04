import { ConfigProvider } from "antd";
import { FilterByCharacters } from "./components/FilterByCharacters/FilterByCharacters";
import { Searchbar } from "./components/Searchbar/Searchbar";
import { ContextProvider } from "./store/useGetApplicationState";
import ErrorBoundary from "./utils/ErrorBoundary";
import React from "react";

const ComicListLazy = React.lazy(
  () => import("./components/ComicList/ComicList")
);
function App() {
  return (
    <ErrorBoundary>
      <ContextProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#F0131E",
            },
          }}
        >
          <Searchbar />
          <div className="flex flex-col md:p-16">
            <FilterByCharacters />
            <ComicListLazy />
          </div>
        </ConfigProvider>
      </ContextProvider>
    </ErrorBoundary>
  );
}

export default App;
