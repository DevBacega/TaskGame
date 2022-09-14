import { createContext, ReactNode, useEffect, useState } from "react";
interface CountdownContextData {
  minutes: number;
  seconds: number;
  hasFineshed: boolean;
  isActive: boolean;
  startCountdown: () => void;
  resetCountdown: () => void;
  resetCicle: () => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

let countdownTimeOut: NodeJS.Timeout;

export function CountdownProvider({ children }: CountdownProviderProps) {

  const [time, setTime] = useState(0.1 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFineshed, setHasFineshed] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  function startCountdown() {
    !!hasFineshed && setHasFineshed(false);
    setIsActive(true);
  }

  function resetCountdown() {
      clearTimeout(countdownTimeOut);
      setIsActive(false);
      setHasFineshed(false);
      setTime(0.1 * 60);
  }

  function resetCicle() {
    setHasFineshed(false);
    setTime(0.1 * 60);
    setIsActive(true);
  }

  useEffect(() => {
      if(isActive && time > 0) {
          countdownTimeOut = setTimeout(() => {
              setTime(time -1);
          }, 1000);
      } else if (isActive && time === 0) {
          setHasFineshed(true);
          setIsActive(false);
      }
  }, [isActive, time])

  return(
    <CountdownContext.Provider value={{
      minutes,
      seconds,
      hasFineshed,
      isActive,
      startCountdown,
      resetCountdown,
      resetCicle
    }}>
      { children }
    </CountdownContext.Provider>
  )
}