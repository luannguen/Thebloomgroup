/**
 * Get a value from a nested object using a dot-notated path (e.g., 'a.b.0.c')
 */
export const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    
    // Check if it's an array index
    const index = parseInt(key, 10);
    if (!isNaN(index) && Array.isArray(current)) {
      current = current[index];
    } else {
      current = current[key];
    }
  }
  
  return current;
};

/**
 * Set a value in a nested object using a dot-notated path (e.g., 'a.b.0.c')
 * Returns a new object (shallow clone at modified levels)
 */
export const setNestedValue = (obj: any, path: string, value: any): any => {
  if (!path) return obj;
  
  const keys = path.split('.');
  const newData = { ...obj };
  let current = newData;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isNextKeyIndex = !isNaN(parseInt(nextKey, 10));
    
    if (Array.isArray(current[key])) {
      current[key] = [...current[key]];
    } else if (typeof current[key] === 'object' && current[key] !== null) {
      current[key] = { ...current[key] };
    } else {
      // Create path if missing
      current[key] = isNextKeyIndex ? [] : {};
    }
    
    current = current[key];
  }
  
  const lastKey = keys[keys.length - 1];
  const lastIndex = parseInt(lastKey, 10);
  
  if (!isNaN(lastIndex) && Array.isArray(current)) {
    current[lastIndex] = value;
  } else {
    current[lastKey] = value;
  }
  
  return newData;
};
