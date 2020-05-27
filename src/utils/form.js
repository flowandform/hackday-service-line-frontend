export const useFormChanges = (model, watch) => {
  return Object.entries(model).reduce((res, [key, value]) => {
    return {
      ...res,
      [key]: (() => {
        if (Array.isArray(value)) {
          const other = watch(key, value);
          if (value === other) return false;
          if (value.length !== other.length) return true;

          for (let i = 0; i < value.length; i += 1) {
            if (value[i] !== other[i]) return true;
          }

          return false;
        }
        return value !== watch(key, value);
      })(),
    };
  }, {});
};
