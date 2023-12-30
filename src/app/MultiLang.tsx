import React, { useState, useEffect } from "react";

const MultiLang = ({ children, interval = 1000 }) => {
  const childArray = React.Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // クライアントサイドでのみ実行される
    if (typeof window !== "undefined") {
      const lastIndex = childArray.length - 1;
      const intervalId = setInterval(() => {
        setCurrentIndex((currentIndex) =>
          currentIndex < lastIndex ? currentIndex + 1 : 0
        );
      }, interval);

      return () => clearInterval(intervalId);
    }
  }, [childArray.length, interval]);

  return <>{childArray[currentIndex]}</>;
};

export default MultiLang;
