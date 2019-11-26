import { FormatType } from "./types";

export const formatData = async (
  formating: {
    [key: string]: any;
  },
  data: {
    [key: string]: any;
  }
) => {
  return new Promise(resolve => {
    const formatingKeys = Object.keys(formating);

    formatingKeys.forEach(k => {
      if (k in data) {
        data[k] = formating[k](data[k]);
      }
    });
    
    return resolve();
  });
};

export const formatEmail = (email: string) => String(email).toLowerCase();

export const formatString = (email: string) => String(email);

export const formatBoolean = (email: string) => Boolean(email);

export const formatNumber = (email: string) => Number(email);

export const formatObject = (formatType: FormatType) => (obj: {
    [key: string]: any;
  }) => {
    switch (formatType) {
        case FormatType.Boolean:
            for (const key in obj) {
                obj[key] = formatBoolean(obj[key]);
            }
            return obj;
        case FormatType.Number:
            for (const key in obj) {
                obj[key] = formatNumber(obj[key]);
            }
            return obj;
        case FormatType.String:
            for (const key in obj) {
                obj[key] = formatString(obj[key]);
            }
            return obj;
    
        default:
            return obj;
    }
}
