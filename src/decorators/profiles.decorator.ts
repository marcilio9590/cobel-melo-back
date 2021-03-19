import { SetMetadata } from '@nestjs/common';
import { ProfileTypes } from '../enums/profiles.enum';

export const PROFILE_TYPE_KEY = 'profileTypes';
export const Profile = (profileTypes: ProfileTypes[]) => SetMetadata(PROFILE_TYPE_KEY, profileTypes);