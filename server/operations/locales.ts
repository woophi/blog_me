import LanguageModel from 'server/models/language';
import { get, set } from 'server/options';
import { Request } from 'express';
import { Locales } from 'server/models/types';

export const getLocaleIds = async () => {
  const cashe = get('locales');
  if (!cashe) {
    const locales = await LanguageModel.find().select('localeId -_id').lean() as { localeId: string }[];
    const map = locales.map(l => l.localeId);
    set('locales', map);
    return map;
  } else {
    return cashe as string[];
  }
}

export const getLanguageData = async (req: Request) => {
  const localeIds = await getLocaleIds();
  const lng = req.acceptsLanguages(localeIds);
  const localeId = lng || 'en';
  const languageId = await LanguageModel.findOne()
    .where({
      localeId,
      deleted: null
    })
    .select('id')
    .lean();
  return {
    id: languageId._id,
    localeId
  };
};

export const getLanguageIdByLocaleId = async (localeId: Locales) => {
  const languageId = await LanguageModel.findOne()
  .where({
    localeId,
    deleted: null
  })
  .select('id')
  .lean();

  return languageId._id;
}
