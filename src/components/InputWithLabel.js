import { useEffect, useRef } from "react";

const InputWithLabel = ({
  id,
  value,
  onInputChange,
  type = "text",
  isFocused,
  children,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        value={value}
        id={id}
        type={type}
        onChange={onInputChange}
        autoFocus={isFocused}
        ref={inputRef}
      />
    </>
  );
};

export default InputWithLabel;
