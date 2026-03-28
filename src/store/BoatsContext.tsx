import React, { createContext, useCallback, useContext, useState } from "react";
import rawBoats from "../data/boats.json";
import { type TimeValue, ZERO_TIME } from "../utils/time";

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
  referenceBoat: string | null;
  setReferenceBoat: (name: string | null) => void;
  elapsedTime: TimeValue;
  setElapsedTime: (t: TimeValue) => void;
};

const BoatsContext = createContext<BoatsContextType | null>(null);

const initial: Boat[] = rawBoats.map((b) => ({ ...b, visible: true }));

export function BoatsProvider({ children }: { children: React.ReactNode }) {
  const [boats, setBoats] = useState<Boat[]>(initial);
  const [referenceBoat, setReferenceBoat] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<TimeValue>({ hours: 1, minutes: 0, seconds: 0 });

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
    <BoatsContext.Provider
      value={{
        boats,
        toggleVisibility,
        reset,
        updatePY,
        referenceBoat,
        setReferenceBoat,
        elapsedTime,
        setElapsedTime,
      }}
    >
      {children}
    </BoatsContext.Provider>
  );
}

export function useBoats() {
  const ctx = useContext(BoatsContext);
  if (!ctx) throw new Error("useBoats must be used within BoatsProvider");
  return ctx;
}
