type LocalStorageManagerType = {
  get: <T>(userId: number | string, key?: string) => T,
  set: (userId: number | string, key: string, value: any) => void,
  delete: (userId: number | string, key?: number | string) => void,
};

const getStorageItem = (key: string) => {
  try {
    return localStorage.getItem(key);
  }
  catch (e) {
    console.warn(e);
    return null;
  }
};

const setStorageItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  }
  catch (e) {
    console.warn(e);
  }
};

const removeStorageItem = (key: string) => {
  try {
    localStorage.removeItem(key);
  }
  catch (e) {
    console.warn(e);
  }
};

export const LocalStorageManager: LocalStorageManagerType = {
  get: (userId, key) => {
    const item: any = JSON.parse(getStorageItem(`${userId}`));
    if (key && item) {
      return item[key];
    }
    return item;
  },

  set: (userId, key, value) => {
    if (!userId) {
      return;
    }

    if (!key) {
      setStorageItem(`${userId}`, typeof value === 'object' ? JSON.stringify(value) : `${value}`);
      return value;
    }

    const data = <object>LocalStorageManager.get(userId);
    const object: object = {
      ...data,
      [key]: value
    };
    setStorageItem(`${userId}`, JSON.stringify(object));
    return object;
  },

  delete: (userId, key) => {
    if (!userId) {
      return;
    }

    if (key === undefined) {
      removeStorageItem(`${userId}`);
    }

    const storedObj = LocalStorageManager.get(userId);

    if (storedObj && Object.prototype.hasOwnProperty.call(storedObj, key)) {
      delete storedObj[key];
      if (!Object.keys(storedObj).length) {
        LocalStorageManager.delete(userId);
      } else {
        setStorageItem(`${userId}`, JSON.stringify(storedObj));
      }
    }
  }
};
