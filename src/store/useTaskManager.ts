import { create } from "zustand";
import { Task } from "@/pages/tasks";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TASK_KEY } from "@/utils/constants";

type State = {
  tasks: Task[];
  searchTask: string;
};

type Actions = {
  setSearchTask(keyword: string): void;
  addTask(task: Task): void;
  updateTask(id: number, updated: Partial<Task>): void;
  deleteTask(id: number): void;
};

const getTasksFromLocalStorage = (
  read: (key: string) => string | null
): Task[] => {
  try {
    const tasks = read(TASK_KEY) ?? "";
    return JSON.parse(tasks);
  } catch (e) {
    return [];
  }
};

const useTaskManager = create<State & Actions>((set, get) => {
  const { read } = useLocalStorage();

  return {
    tasks: getTasksFromLocalStorage(read),
    searchTask: "",
    addTask: (task: Task) => {
      set({
        tasks: [...get().tasks, task],
      });
    },
    deleteTask(id: number) {
      const tasks = get().tasks;

      const updated = tasks.reduce(
        (prev, current) => (current.id === id ? prev : [...prev, current]),
        [] as Task[]
      );

      set({ tasks: updated });
    },
    updateTask(id: number, partialUpdate: Partial<Task>) {
      const tasks = get().tasks;

      const updated = tasks.reduce((prev, curr) => {
        if (curr.id === id) {
          curr = { ...curr, ...partialUpdate };
        }
        return [...prev, curr];
      }, [] as Task[]);

      set({
        tasks: updated,
      });
    },
    setSearchTask(searchTask: string) {
      set({
        searchTask,
      });
    },
  };
});

export { useTaskManager };
