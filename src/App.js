import "./App.css";
import { useCallback, useEffect, useReducer, useState } from "react";
import List from "./components/List";
import InputWithLabel from "./components/InputWithLabel";
import { useSemiPersistentState } from "./hooks/useSemiPersistentState";

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

function App() {

	const storiesReducer = (state, action) => {
		switch (action.type) {
			case 'STORIES_FETCH_INIT': 
				return {
					...state,
					isLoading: true,
					isError: false
				} 
			case 'STORIES_FETCH_SUCCESS': 
				return {
					...state,
					isLoading: false,
					isError: false,
					data: action.payload
				} 
			case 'STORIES_FETCH_FAILURE': 
				return {
					...state,
					isLoading: false,
					isError: true
				} 
			case 'REMOVE_STORY':
				return {
					...state,
					data: state.data.filter(story => action.payload.objectID !== story.objectID)
				}	
			default:
				throw new Error();
		}
	}

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
	const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
  const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false)

	const handleFetchStories = useCallback(() => {

		if (!searchTerm) return
		dispatchStories({ type: 'STORIES_FETCH_INIT' })
		fetch(`${API_ENDPOINT}${searchTerm}`).then(response => response.json()).then((result) => {
			dispatchStories({
				type: 'STORIES_FETCH_SUCCESS',
				payload: result.hits
			})
      setIsLoading(false);
		}).catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }))
  }, [searchTerm]);

	useEffect(() => {
		handleFetchStories()
	}, [handleFetchStories])

  useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleRemoveStory = (item) => {
		dispatchStories({
			type: 'REMOVE_STORY',
			payload: item 
		})
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
        isFocused
      >
        <strong>Search: </strong>
      </InputWithLabel>
      <hr />
			{stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

export default App;
