/**
 * Converts snake_case keys in an object to camelCase.
 * Does not mutate the original object.
 */
export const snakeToCamel = (str) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const mapFieldsToCamelCase = (obj) => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj) || obj instanceof Date) {
    return obj;
  }

  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamel(key);
      result[camelKey] = mapFieldsToCamelCase(obj[key]);
    }
  }
  return result;
};

export const mapArrayToCamelCase = (arr) => {
  if (!Array.isArray(arr)) return arr;
  return arr.map(mapFieldsToCamelCase);
};
