import { createContext, ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { LevelUpModal } from "../components/LevelUpModal";
import { API } from "../core/appConfig";
import ITask from "../dto/ITask";

interface ChallengesContextData {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallenge: ITask;
  experienceToNextLevel: number;
  levelUp: () => void;
  startNewChallenge: (id: number) => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
  closeLevelUpModal: () => void;
  incressXP: () => void;
}

interface ChallengesProviderProps {
  children: ReactNode;
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({
  children,
  ...rest
}: ChallengesProviderProps) {

  const [level, setLevel] = useState(rest.level ?? 1);
  
  const [currentExperience, setCurrentExperience] = useState(
    rest.currentExperience ?? 0
  );
  const [challengesCompleted, setChallengesCompleted] = useState(
    rest.challengesCompleted ?? 0
  );

  const [activeChallenge, setActiveChallenge] = useState<ITask>(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    Cookies.set("level", String(level));
    Cookies.set("currentExperience", String(currentExperience));
    Cookies.set("challengesCompleted", String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted]);

  function levelUp() {
    setLevel(level + 1);
    setIsLevelUpModalOpen(true);
  }

  function incressXP() {
    setActiveChallenge( old => ({
      ...old,
      amount: old.amount + 50
    }))

    if (Notification.permission === "granted") {
      new Notification("XP Aumentada!", {
        body: `Valendo ${activeChallenge.amount + 50}xp!`,
      });
    }

  }

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false);
  }

  async function startNewChallenge(id: number) {
    const task: ITask = await fetch(`${API}/task/${id}`).then((res) =>
      res.json()
    );
    setActiveChallenge(task);

    new Audio("/notification.mp3").play();

    if (Notification.permission === "granted") {
      new Notification("Nova tarefa", {
        body: `Valendo ${task.amount}xp!`,
      });
    }
  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  async function completeChallenge() {
    if (!activeChallenge) {
      console.log(activeChallenge)
      return;
    }

    const { amount } = activeChallenge;

    let finalExpirence = currentExperience + amount;
    if (finalExpirence >= experienceToNextLevel) {
      finalExpirence -= experienceToNextLevel;
      levelUp();
    }

    setCurrentExperience(finalExpirence);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted + 1);
    await fetch(`${API}/task/${activeChallenge.id}/complete`, { method: "PUT" }).then((res) => res.json());
 
  }

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        challengesCompleted,
        activeChallenge,
        experienceToNextLevel,
        levelUp,
        startNewChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal,
        incressXP
      }}
    >
      {children}

      {isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  );
}
