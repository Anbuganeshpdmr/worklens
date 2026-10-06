import { createContext, useContext, useState } from "react";

const EntryContext = createContext();

export const EntryProvider = ({ children }) => {
  const [entryVersion, setEntryVersion] = useState(0);

  const notifyEntryChange = () => {
    setEntryVersion((prev) => prev + 1);
  };

  return (
    <EntryContext.Provider
      value={{
        entryVersion,
        notifyEntryChange,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export const useEntryContext = () => {
  return useContext(EntryContext);
};
