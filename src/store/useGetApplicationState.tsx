import { ReactNode, createContext, useContext, useReducer } from "react";

type State = {
  title: string;
  pageNo: number;
  characters: Record<string, string>;
};

enum ActionType {
  PageNumber = "PAGE_NO",
  FilterByTitle = "FILTER_BY_TITLE",
  FilterByCharacters = "FILTER_BY_CHARACTERS",
  ResetFilterByCharacters = "RESET_FILTERS",
}
type Action =
  | {
      type: ActionType.PageNumber;
      pageNumber: number;
    }
  | { type: ActionType.FilterByTitle; title: string }
  | { type: ActionType.FilterByCharacters; characters: Record<string, string> }
  | { type: ActionType.ResetFilterByCharacters };
const Context = createContext({
  title: "",
  pageNo: 1,
  characters: {},
  setPageNumber: (_: number) => {},
  setSearchTitle: (_: string) => {},
  setCharacters: (_: number, _characterName: string) => {},
  clearFilters: () => {},
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.PageNumber:
      return { ...state, pageNo: action.pageNumber };
    case ActionType.FilterByTitle:
      return { ...state, title: action.title, pageNo: 1 };
    case ActionType.FilterByCharacters:
      return { ...state, characters: action.characters, pageNo: 1 };
    case ActionType.ResetFilterByCharacters:
      return { ...state, characters: {}, pageNo: 1 };
    default:
      return state;
  }
};
export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    pageNo: 1,
    title: "",
    characters: {},
  });
  const setPageNumber = (pageNumber: number): void => {
    dispatch({ type: ActionType.PageNumber, pageNumber });
  };
  const setSearchTitle = (title: string): void => {
    if (title !== state.title) {
      dispatch({ type: ActionType.FilterByTitle, title });
    }
  };
  const setCharacters = (characterId: number, characterName: string) => {
    const characters = state.characters;
    if (Object.keys(characters).includes(characterId.toString())) {
      delete characters[characterId];
    } else {
      characters[characterId] = characterName;
    }

    dispatch({
      type: ActionType.FilterByCharacters,
      characters,
    });
  };

  const clearFilters = () => {
    dispatch({ type: ActionType.ResetFilterByCharacters });
  };
  return (
    <Context.Provider
      value={{
        pageNo: state.pageNo,
        title: state.title,
        characters: state.characters,
        setPageNumber,
        setSearchTitle,
        setCharacters,
        clearFilters,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useGetApplicationState = () => {
  const context = useContext(Context);

  return context;
};
