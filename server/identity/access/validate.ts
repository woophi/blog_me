import { verifyToken } from './verify';
import { requireUser } from './claims';
import { Request, Response, NextFunction } from 'express';
import { ROLES } from './constants';
import { HTTPStatus } from 'server/lib/models';

export const getToken = (req: Request) => {
  return req.headers.authorization || (req.session.user && req.session.accessToken) || '';
}

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
	if (!requireUser(req, res)) return;
	const userId = req.session.userId;
	const token = getToken(req);
	if (!token)
		return res.send({ error: 'Authentication failed' }).status(HTTPStatus.Unauthorized);

	const { claims, verificaitionError } = verifyToken(token);
  if (verificaitionError)
    return res.send({ error: 'Authentication failed' }).status(HTTPStatus.Forbidden);

  if (userId && userId !== claims.id)
    return res.send({ error: 'Authentication failed' }).status(HTTPStatus.BadRequest);
	next();
}

export const authorizedForAdmin = (req: Request,  res: Response,  next: NextFunction) => {
	if (!requireUser(req, res)) return;
  const token = getToken(req);
  const { claims, verificaitionError } = verifyToken(token);
	if (verificaitionError)
		return res.send({ error: 'Authentication failed' }).status(HTTPStatus.Forbidden);

  if (!claims.roles.find(r => r === ROLES.GODLIKE || r === ROLES.ADMIN))
    return res.send({ error: 'Unable to get data' }).status(HTTPStatus.BadRequest);
	next();
}

export const authorizedForSuperAdmin = (req: Request,  res: Response,  next: NextFunction) => {
	if (!requireUser(req, res)) return;
  const token = getToken(req);
	const { claims, verificaitionError } = verifyToken(token);
	if (verificaitionError)
		return res.send({ error: 'Authentication failed' }).status(HTTPStatus.Forbidden);

	if (!claims.roles.find(r => r === ROLES.GODLIKE))
    return res.send({ error: 'Unable to get data' }).status(HTTPStatus.BadRequest);
	next();
}
