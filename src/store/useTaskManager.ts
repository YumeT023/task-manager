import { create } from "zustand";
import { Task } from "@/pages/tasks";

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

const useTaskManager = create<State & Actions>((set, get) => ({
  tasks: [],
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
}));

export { useTaskManager };
