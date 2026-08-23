"use client";
import React, { createContext, useContext, useState } from "react";
//Create DynamicPathContexType
type DynamicPathContextType = {
  labels: Record<string, string>;
  setLabel: (path: string, label: string) => void;
};

const DynamicPathContext = createContext<DynamicPathContextType | undefined>(
  undefined,
);

export function DynamicPathProvider({
  childern,
}: {
  childern: React.ReactNode;
}) {
  const [labels, setLabels] = useState<Record<string, string>>({});
  const setLabel = (path: string, label: string) => {
    setLabels((prev) => ({ ...prev, [path]: label }));
  };

  return (
    <DynamicPathContext.Provider value={{ labels, setLabel }}>
      {childern}
    </DynamicPathContext.Provider>
  );
}

export function useDynamicPath() {
  const contex = useContext(DynamicPathContext);
  if (!contex)
    throw new Error("useDynamicPath must be used in side DynamicPathProvider");
  return contex;
}
