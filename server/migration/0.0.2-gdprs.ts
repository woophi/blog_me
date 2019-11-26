import { GDPRSaveModel } from 'server/models/types';
import GDPRModel from '../models/gdpr';
import { Locales } from 'server/models/types';
import { Logger } from 'server/logger';
import { getLanguageIdByLocaleId } from 'server/operations';

const createGDPRS = async (done) => {
  try {
    const languageIdEn = await getLanguageIdByLocaleId(Locales.EN);
    const languageIdCs = await getLanguageIdByLocaleId(Locales.CS);
    const languageIdRu = await getLanguageIdByLocaleId(Locales.RU);

    await new GDPRModel({
      language: languageIdEn,
       text: 'GDPR EN'
    } as GDPRSaveModel).save();
    await new GDPRModel({
      language: languageIdCs,
       text: 'GDPR CS'
    } as GDPRSaveModel).save();
    await new GDPRModel({
      language: languageIdRu,
       text: 'GDPR RU'
    } as GDPRSaveModel).save();

    return done();
  } catch (error) {
    Logger.error('faild to migrate gdprs', error);
    return done(error);
  }
}

module.exports = (done) => createGDPRS(done);
