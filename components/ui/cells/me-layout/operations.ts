import { callUserApi } from 'core/common';
import { ProfileFormModel } from './types';

export const updateUserProfile = (
  data: Omit<ProfileFormModel, 'gravatarPhotoUrl' | 'userId'>
) => callUserApi('put', 'api/app/user/me', data);
