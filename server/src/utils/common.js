/**
 * Change key name for mapping object schema
 *
 * @param {obj} keysMap
 * @param {obj} original
 */

export const renameKeys = (keysMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
    }),
    {}
  );
