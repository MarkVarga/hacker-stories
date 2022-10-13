
const Search = ({ onSearch, search }) => {
	
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input value={search} id="search" type="text" onChange={onSearch} />
    </div>
  );
};

export default Search;
