import { Request, Response, NextFunction } from 'express';
import FilesModel from 'server/models/files';
import { HTTPStatus } from 'server/lib/models';

export const getAllFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = await FilesModel.find().select('name url format id').lean();

  return res.send(files).status(HTTPStatus.OK);
}