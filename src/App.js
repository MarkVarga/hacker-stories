import "./App.css";
import { useEffect, useReducer, useState } from "react";
import List from "./components/List";
import InputWithLabel from "./components/InputWithLabel";
import { useSemiPersistentState } from "./hooks/useSemiPersistentState";

function App() {
  const initialStories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://reduxjs.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const getAsyncStories = () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
    );

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

  useEffect(() => {
		dispatchStories({ type: 'STORIES_FETCH_INIT' })
    getAsyncStories().then((result) => {
			dispatchStories({
				type: 'STORIES_FETCH_SUCCESS',
				payload: result.data.stories
			})
      setIsLoading(false);
		}).catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }))
  }, []);

  useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

export default App;
