import { Request } from 'express';

export const getUserIp = (req: Request) => {
	const ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		null;
	return ip;
};