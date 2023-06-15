const useLocalStorage = () => {
  return {
    read: (key: string) => localStorage.getItem(key),
    save: (key: string, value: string) => localStorage.setItem(key, value),
  };
};

export { useLocalStorage };
