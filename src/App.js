import axios from "axios";
import { sortBy } from 'lodash'
import "./App.css";
import { useCallback, useEffect, useReducer, useState } from "react";
import List from "./components/List";
import SearchForm from "./components/SearchForm";
import { useSemiPersistentState } from "./hooks/useSemiPersistentState";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

function App() {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
	const [sort, setSort] = useState({
		sortKey: "NONE",
		isReverse: false
	});

  const handleSort = (sortKey) => {
		const isReverse = sort.sortKey === sortKey && !sort.isReverse
		setSort({ sortKey, isReverse });
  };

	const SORTS = {
		NONE: (sortedList) => sortedList,
		TITLE: (sortedList) => sortBy(sortedList, 'title'),
		AUTHOR: (sortedList) => sortBy(sortedList, 'author'),
		COMMENT: (sortedList) => sortBy(sortedList, 'num_comments').reverse(),
		POINT: (sortedList) => sortBy(sortedList, 'points').reverse(),
	}

	const sortFunction = SORTS[sort.sortKey]
	const sortedList = sort.isReverse ? sortFunction(stories.data).reverse() : sortFunction(stories.data)

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const result = await axios.get(url);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({
        type: "STORIES_FETCH_INIT",
      });
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <hr />
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List handleSort={handleSort} list={sortedList} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

export default App;
