import React, { ChangeEvent, useEffect, useRef } from "react";
import { useTaskManager } from "@/store/useTaskManager";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import dynamic from "next/dynamic";
import { TASK_KEY } from "@/utils/constants";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const TaskManager = () => {
  const createTaskRef = useRef<HTMLInputElement>(null);
  const { save } = useLocalStorage();
  const { tasks, setSearchTask, searchTask, addTask, updateTask, deleteTask } =
    useTaskManager();

  useEffect(() => {
    // listener for changes made into tasks
    const unsubscribe = useTaskManager.subscribe((state) => {
      save(TASK_KEY, JSON.stringify(state.tasks));
    });

    return () => {
      // eventually remove listener to avoid memory leaks
      unsubscribe();
    };
  }, []);

  const handleAddTask = () => {
    const title = createTaskRef.current?.value ?? "";
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    addTask(newTask);
  };

  const handleUpdateTask = (taskId: number, updatedTask: Partial<Task>) => {
    updateTask(taskId, updatedTask);
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask(taskId);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTask(e.target.value);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTask.toLowerCase())
  );

  return (
    <div>
      <h1>Task Manager</h1>

      <input type="text" ref={createTaskRef} />

      <button onClick={handleAddTask}>Add Task</button>

      <input type="text" onChange={handleSearch} placeholder="Search Task" />

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <input
              type="text"
              value={task.title}
              onChange={(e) =>
                handleUpdateTask(task.id, { title: e.target.value })
              }
            />
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default dynamic(() => Promise.resolve(TaskManager), {
  ssr: false,
});
