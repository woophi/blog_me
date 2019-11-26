import { SchemaNames, LanguageModel } from 'server/models/types';

exports.create = {
  [SchemaNames.LANGUAGE]: [
    {
      'name': 'English',
      'localeId': 'en',
    },
    {
      'name': 'Русский',
      'localeId': 'ru',
    },
    {
      'name': 'Czech',
      'localeId': 'cs',
    }
  ] as LanguageModel[]
}
