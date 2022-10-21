const LastSearches = ({ lastSearches, onLastSearch }) => {
  return (
    <>
      {lastSearches.map((searchTerm, index) => (
        <button
          key={searchTerm + index}
          type="button"
          onClick={() => onLastSearch(searchTerm)}
        >
          {searchTerm}
        </button>
      ))}
    </>
  );
};

export default LastSearches;
