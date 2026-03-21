import { createContext, useContext, useState } from "react";

// 1. Defines la forma del context
type CounterContextType = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

// 2. Creas el context con un valor por defecto
export const CounterContext = createContext<CounterContextType>({
  count: 0,
  increment: () => {},
  decrement: () => {},
});

// 3. Creas el Provider (el "envoltorio" que comparte el estado)
export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  return (
    <CounterContext.Provider value={{ count, increment, decrement }}>
      {children}
    </CounterContext.Provider>
  );
}

// 4. Hook personalizado para usar el context fácilmente
export function useCounter() {
  return useContext(CounterContext);
}
