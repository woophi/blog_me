exports._options = {};

export const get = (key: string) => {
  return this._options[key];
}
export const set = (key: any, value: any) => {
  this._options[key] = value;
}
