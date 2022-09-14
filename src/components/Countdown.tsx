import { useContext } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";
import { CountdownContext } from "../contexts/CountdownContext";
import styles from "../styles/components/Countdown.module.css";

export function Countdown() {
  const { minutes, seconds, hasFineshed, isActive, resetCountdown, resetCicle } =
    useContext(CountdownContext);

  const { resetChallenge, incressXP, completeChallenge } = useContext(ChallengesContext);

  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split("");
  const [secondLeft, secondRight] = String(seconds).padStart(2, "0").split("");

  function cleanChallenge() {
    resetCountdown();
    resetChallenge();
  }

  function extendChallenge() {
    resetCicle()
    incressXP()
  }

  function completeTask() {
    completeChallenge()
    resetCountdown()
  }

  return (
    <div>
      <div className={styles.countdownContainer}>
        <div>
          <span>{minuteLeft}</span>
          <span>{minuteRight}</span>
        </div>
        <span>:</span>
        <div>
          <span>{secondLeft}</span>
          <span>{secondRight}</span>
        </div>
      </div>

      {hasFineshed ? (
        <div className={styles.boxButton}>
          <div>
            <button className={`${styles.countdownButton} ${styles.extendButton}`} onClick={extendChallenge}>
              Fazer mais 1 ciclo
            </button>
            <button className={`${styles.countdownButton} ${styles.countdownButtonActive}`} onClick={cleanChallenge}>
              Abandonar Tarefa
            </button>
          </div>
          <button className={`${styles.countdownButton} ${styles.countdownButtonDone}`} onClick={completeTask}>
            Concluir Tarefa
          </button>
        </div>
      ) : (
        <>
          {isActive && (
            <button
              type="button"
              className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
              onClick={cleanChallenge}
            >
              Abandonar ciclo
            </button>
          )}
        </>
      )}
    </div>
  );
}
