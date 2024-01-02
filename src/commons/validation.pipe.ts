import {
  UsePipes,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

export function CheckDto(group?: string) {
  const options: ValidationPipeOptions = {
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
    validationError: { target: false },
  };
  if (group) {
    options.groups = [group];
  }
  return UsePipes(new ValidationPipe(options));
}
