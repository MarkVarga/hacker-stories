import Item from "./Item"

const List = ({ list }) => {
	return (
      <ul>
        {list.map((item) => (
					<Item key={item.objectID} item={item} />
        ))}
      </ul>
	)
}

export default List
