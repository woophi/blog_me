import config from 'server/config';
import * as jwt from 'jsonwebtoken';
import { Claims } from './constants';

export const verifyToken = (token: string) => {
	let result = {
		verificaitionError: null,
		claims: {} as Claims
	};
	jwt.verify(token, config.ACCESS_SECRET, (err, decoded: Claims) => {
		result.verificaitionError = err;
		result.claims = decoded;
	});
	return result;
}
