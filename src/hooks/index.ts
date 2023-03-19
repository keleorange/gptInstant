import React from "react";

export const useClickOutside = (ref: React.RefObject<HTMLDivElement>, callback: (e: any) => void) => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback(e);
      }
    };
    React.useEffect(() => {
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    });
  };
  