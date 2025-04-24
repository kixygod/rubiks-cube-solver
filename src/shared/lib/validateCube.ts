export function validateCubeColors(cube: string[]): {
  valid: boolean;
  error?: string;
} {
  if (cube.length !== 54) {
    return { valid: false, error: "Кубик должен содержать 54 наклейки." };
  }

  const colorCounts: Record<string, number> = {};

  for (const color of cube) {
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  }

  const entries = Object.entries(colorCounts);
  if (entries.length !== 6) {
    return { valid: false, error: "Должно быть ровно 6 цветов." };
  }

  for (const [color, count] of entries) {
    if (count !== 9) {
      return {
        valid: false,
        error: `Цвет ${color} встречается ${count} раз вместо 9.`,
      };
    }
  }

  return { valid: true };
}
