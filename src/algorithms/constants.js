export const ALGORITHM_LABELS = {
  fifo: "FIFO",
  lru: "LRU",
  optimal: "Optimal",
};

export const ALGORITHM_DESCRIPTIONS = {
  fifo: "First In First Out: the oldest page in memory is replaced first.",
  lru: "Least Recently Used: the page not used for the longest time is replaced.",
  optimal: "Optimal: replace the page whose next use is farthest in the future.",
};
