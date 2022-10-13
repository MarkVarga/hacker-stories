import "./App.css";
import { useEffect } from "react";
import List from "./components/List";
import InputWithLabel from "./components/InputWithLabel";
import { useSemiPersistentState } from "./hooks/useSemiPersistentState";

function App() {
  const stories = [
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
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
			<InputWithLabel id="search" value={searchTerm} onInputChange={handleSearch} isFocused>
				<strong>Search: </strong>  
			</InputWithLabel>
      <hr />
      <List list={searchedStories} />
    </div>
  );
}

export default App;
