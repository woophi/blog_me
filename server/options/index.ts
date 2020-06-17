exports._options = {};

export const get = (key: GlobalCache) => {
  return this._options[key];
}
export const set = (key: GlobalCache, value: any) => {
  this._options[key] = value;
}

export enum GlobalCache {
  Locales = 'locales',
  PrevUrl = 'prevUrl',
  ReleaseVersion = 'rv'
}