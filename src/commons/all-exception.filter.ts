import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter<T extends Error>
  implements ExceptionFilter<T>
{
  @Inject()
  private readonly logger: Logger;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: T, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus, message;
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = (exception.getResponse() as any)?.message;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    }

    const responseBody = {
      code: -1,
      message: message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    this.logger.warn(responseBody);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
