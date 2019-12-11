import UserModel from 'server/models/users';
import { User, Locales } from 'server/models/types';
import { generateRandomString } from 'server/utils/prgn';
import * as identity from 'server/identity';
import { ROLES } from 'server/identity';
import { getLanguageIdByLocaleId } from './locales';

const hashing = new identity.Hashing();
export const registerExternalUser = async (email: string, name: string) => {
  const user = (await UserModel.findOne({ email }).lean()) as User;

  if (user) return user;

  let password = generateRandomString(6);
  password = await hashing.hashPassword(password);
  const language = await getLanguageIdByLocaleId(Locales.RU);
  const newUser = await new UserModel({
    email,
    name,
    password,
    roles: [ROLES.COMMENT],
    language
  }).save();
  return newUser;
};
