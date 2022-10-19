import { useState } from "react";
import Item from "./Item";

const List = ({ list, onRemoveItem, handleSort }) => {

  return (
    <ul>
      <li style={{ display: "flex" }}>
        <span style={{ width: "40%" }}>
					<button type="button" onClick={() => handleSort('TITLE')}>
            Title
          </button>
        </span>
        <span style={{ width: "30%" }}>
          <button type="button" onClick={() => handleSort('AUTHOR')}>
            Author
          </button>
				</span>
        <span style={{ width: "10%" }}>
          <button type="button" onClick={() => handleSort('COMMENT')}>
           Comments 
          </button>
				</span>
        <span style={{ width: "10%" }}>

          <button type="button" onClick={() => handleSort('POINT')}>
          Points 
          </button>
				</span>
        <span style={{ width: "10%" }}>Actions</span>
      </li>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );
};

export default List;
