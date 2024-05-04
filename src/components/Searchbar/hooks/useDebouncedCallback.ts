export function useDebouncedCallback(callback: Function, delay: number) {
  let timeout: NodeJS.Timeout;

  return function (value: string) {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(value), delay);
  };
}
