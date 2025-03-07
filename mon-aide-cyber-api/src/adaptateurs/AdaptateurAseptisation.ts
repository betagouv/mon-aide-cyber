import { RequestHandler } from 'express';

export interface AdaptateurAseptisation {
  aseptise(...champsAAseptiser: string[]): RequestHandler;
}
