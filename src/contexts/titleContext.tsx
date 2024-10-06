import React, { createContext, useState, ReactNode } from "react";

// Define the shape of your context
interface TitleContextType {
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  saveTitle: (data: string) => void;
  resetTitle: () => void;
}

const defaultTitleContext: TitleContextType = {
  projectTitle: "Untitled Project",
  setProjectTitle: () => {},
  saveTitle: () => {},
  resetTitle: () => {},
};

// Create the context with a default value
export const TitleContext =
  createContext<TitleContextType>(defaultTitleContext);

// Create a provider component
interface TitleProviderProps {
  children: ReactNode;
}

export const TitleProvider: React.FC<TitleProviderProps> = ({ children }) => {
  const [projectTitle, setProjectTitle] = useState<string>(
    defaultTitleContext.projectTitle
  );

  const saveTitle = (data: string) => {
    localStorage.setItem("projectTitle", JSON.stringify(data));
  };

  const resetTitle = () => {
    setProjectTitle(defaultTitleContext.projectTitle);
  };

  return (
    <TitleContext.Provider
      value={{
        projectTitle,
        setProjectTitle,
        saveTitle,
        resetTitle,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};
