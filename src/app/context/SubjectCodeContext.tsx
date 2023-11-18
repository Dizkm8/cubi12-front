import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface CodeContextProps {
  codes: string[];
  setCodes: Dispatch<SetStateAction<string[]>>;
}

const SubjectCodeContext = createContext<CodeContextProps | undefined>(undefined);

interface CodeProviderProps {
  children: ReactNode;
}

export const CodeProvider: React.FC<CodeProviderProps> = ({ children }) => {
  const [codes, setCodes] = useState<string[]>([]);

  return (
    <SubjectCodeContext.Provider value={{ codes, setCodes }}>
      {children}
    </SubjectCodeContext.Provider>
  );
};

export const useSubjectCodeContext = () => {
  const context = useContext(SubjectCodeContext);
  if (!context) {
    throw new Error('useSubjectCodeContext must be used within a CodeProvider');
  }
  return context;
};
