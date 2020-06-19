import { NextFunction } from 'express';
import { IncomingMessage, ServerResponse } from 'http';

export type NextHandleFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => void;
