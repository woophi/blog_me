import { verifyToken } from './verify';
import { requireUser } from './claims';
import { Request, Response, NextFunction } from 'express-serve-static-core';
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
		return res.status(HTTPStatus.Unauthorized).send({ error: 'Authentication failed' });

	const { claims, verificaitionError } = verifyToken(token);
  if (verificaitionError)
    return res.status(HTTPStatus.Forbidden).send({ error: 'Authentication failed' });

  if (userId && userId !== claims.id)
    return res.status(HTTPStatus.BadRequest).send({ error: 'Authentication failed' });
	next();
}

export const authorizedForAdmin = (req: Request,  res: Response,  next: NextFunction) => {
	if (!requireUser(req, res)) return;
  const token = getToken(req);
  const { claims, verificaitionError } = verifyToken(token);
	if (verificaitionError)
		return res.status(HTTPStatus.Forbidden).send({ error: 'Authentication failed' });

  if (!claims.roles.find(r => r === ROLES.GODLIKE || r === ROLES.ADMIN))
    return res.status(HTTPStatus.BadRequest).send({ error: 'Unable to get data' });
	next();
}

export const authorizedForSuperAdmin = (req: Request,  res: Response,  next: NextFunction) => {
	if (!requireUser(req, res)) return;
  const token = getToken(req);
	const { claims, verificaitionError } = verifyToken(token);
	if (verificaitionError)
		return res.status(HTTPStatus.Forbidden).send({ error: 'Authentication failed' });

	if (!claims.roles.find(r => r === ROLES.GODLIKE))
    return res.status(HTTPStatus.BadRequest).send({ error: 'Unable to get data' });
	next();
}
