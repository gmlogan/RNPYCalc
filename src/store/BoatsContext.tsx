import React, { createContext, useCallback, useContext, useState } from "react";
import rawBoats from "../data/boats.json";

export type Boat = {
  name: string;
  py: number;
  time: string;
  visible: boolean;
};

type BoatsContextType = {
  boats: Boat[];
  toggleVisibility: (name: string) => void;
  reset: () => void;
  updatePY: (name: string, py: number) => void;
};

const BoatsContext = createContext<BoatsContextType | null>(null);

const initial: Boat[] = rawBoats.map((b) => ({ ...b, visible: true }));

export function BoatsProvider({ children }: { children: React.ReactNode }) {
  const [boats, setBoats] = useState<Boat[]>(initial);

  const toggleVisibility = useCallback((name: string) => {
    setBoats((prev) =>
      prev.map((b) => (b.name === name ? { ...b, visible: !b.visible } : b))
    );
  }, []);

  const reset = useCallback(() => {
    setBoats(initial);
  }, []);

  const updatePY = useCallback((name: string, py: number) => {
    setBoats((prev) =>
      prev.map((b) => (b.name === name ? { ...b, py } : b))
    );
  }, []);

  return (
    <BoatsContext.Provider value={{ boats, toggleVisibility, reset, updatePY }}>
      {children}
    </BoatsContext.Provider>
  );
}

export function useBoats() {
  const ctx = useContext(BoatsContext);
  if (!ctx) throw new Error("useBoats must be used within BoatsProvider");
  return ctx;
}
