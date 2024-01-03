import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const logFormat = {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      statusCode: res.statusCode,
      params: req.params,
      query: req.query,
      body: req.body,
    };
    this.logger.log('LoggerMiddleware...');
    this.logger.log(logFormat);
    next();
  }
}
