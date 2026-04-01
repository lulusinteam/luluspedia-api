/**
 * Simple Seeded Random Generator using an LCG-like algorithm.
 * Takes a string seed and returns a function that produces a pseudo-random number between 0 and 1.
 */
export const seededRandom = (seed: string) => {
  // Simple hash function to convert string to numeric seed
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }

  return function() {
    h = Math.imul(48271, h) | 0 & 2147483647;
    return (h & 2147483647) / 2147483648;
  };
};

/**
 * Fisher-Yates Shuffle algorithm with a seeded random generator.
 */
export const seededShuffle = <T>(array: T[], seed: string): T[] => {
  const random = seededRandom(seed);
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
};
