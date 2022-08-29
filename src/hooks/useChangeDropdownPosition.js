import { useState, useEffect } from "react";

export const useChangeDropdownPosition = (
  inputContainerRef,
  dropdownHeight = 200
) => {
  const [isReverse, setIsReverse] = useState(false);
  useEffect(() => {
    const scrollHandler = () => {
      const distanceFromInputToBottom =
        window.innerHeight -
        inputContainerRef.current.getBoundingClientRect().bottom;
      if (distanceFromInputToBottom < dropdownHeight) {
        setIsReverse(true);
      } else {
        setIsReverse(false);
      }
    };
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
    /*eslint-disable  react-hooks/exhaustive-deps*/
  }, []);
  return { isReverse };
};
