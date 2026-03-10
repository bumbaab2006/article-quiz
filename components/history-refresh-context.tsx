"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type HistoryRefreshContextValue = {
  version: number;
  refreshHistory: () => void;
};

const HistoryRefreshContext =
  createContext<HistoryRefreshContextValue | null>(null);

export function HistoryRefreshProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [version, setVersion] = useState(0);

  return (
    <HistoryRefreshContext.Provider
      value={{
        version,
        refreshHistory: () => setVersion((current) => current + 1),
      }}
    >
      {children}
    </HistoryRefreshContext.Provider>
  );
}

export function useHistoryRefresh() {
  const context = useContext(HistoryRefreshContext);

  if (!context) {
    throw new Error(
      "useHistoryRefresh must be used inside HistoryRefreshProvider"
    );
  }

  return context;
}
