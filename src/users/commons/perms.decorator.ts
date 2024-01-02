import { SetMetadata } from '@nestjs/common';

export const PERMS_KEY = 'perms';
export const CheckPerms = (...perms: string[]) => SetMetadata(PERMS_KEY, perms);
