
const Search = ({ onSearch }) => {
	
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={onSearch} />
    </div>
  );
};

export default Search;
