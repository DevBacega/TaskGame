import { useContext, useEffect, useRef, useState } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";
import { CountdownContext } from "../contexts/CountdownContext";
import styles from "../styles/components/TaskBox.module.css";
import { API } from "../core/appConfig";
import ITask from "../dto/ITask";

export function TaskBox() {
  const [taskList, setTaskList] = useState<ITask[]>([]);
  const {
    startNewChallenge,
    activeChallenge,
  } = useContext(ChallengesContext);
  const { startCountdown } = useContext(CountdownContext);
  const ref = useRef<HTMLInputElement>();

  async function getTaskList() {
    console.log('TESTE', API)
    const data = await fetch(`${API}/task`).then((res) => res.json());
    setTaskList(data);
  }

  async function addTaskList() {
    const description = ref.current?.value;
    const data = await fetch(`${API}/task`, {
      method: "POST",
      body: JSON.stringify({ description: description }),
    }).then((res) => res.json());
    setTaskList(data);
  }

  async function deleteTask(id: number) {
    const newTaskList = await fetch(`${API}/task/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
    setTaskList(newTaskList);
  }

  function handleActiveTask(id: number) {
    startNewChallenge(id);
    startCountdown()
  }

  useEffect(() => {
    !activeChallenge && getTaskList();
  }, [activeChallenge]);

  return (
    <>
      <div
        className={styles.addTask}
        style={{ visibility: activeChallenge ? "hidden" : "visible" }}
      >
        <input ref={ref} placeholder="Digite uma tarefa" />
        <a onClick={addTaskList}>+</a>
      </div>
      <div className={styles.taskBoxContainer}>
        {!activeChallenge ? (
          <div className={styles.taskItemContainer}>
            {taskList.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                <input
                  type="checkbox"
                  checked={task.mark}
                  disabled
                  className={styles.taskCheckBox}
                />
                <div>
                  <span>{task.description}</span>
                </div>
                {!task.mark ? (
                  <a
                    className={styles.taskItemPlay}
                    onClick={() => handleActiveTask(task.id)}
                  >
                    ▶︎
                  </a>
                ) : (
                  <a
                    onClick={(_e) => deleteTask(task.id)}
                    className={styles.taskItemDelete}
                  >
                    X
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.taskItemContainer}>
            <span>{activeChallenge.description}</span>
          </div>
        )}
      </div>
    </>
  );
}
