import * as dns from 'dns';
import * as net from 'net';
import { Logger } from 'server/logger';

export const checkMailonPing = async (
  email: string,
  callback: (error, validMail: boolean) => void,
  timeout?: number,
  from_email?: string
) => {
  console.warn('checkMailonPing');
  timeout = timeout || 5000;
  from_email = from_email || email;

  const MAX_EMAIL_LEN = 300;
  if (MAX_EMAIL_LEN < email.length) {
    return callback(null, false);
  }
  if (!/^\S+@\S+$/.test(email)) {
    return callback(null, false);
  }

  try {
    dns.resolveMx(email.split('@')[1], (err, addresses) => {
      if (err || addresses.length === 0) {
        return callback(err, false);
      }
      addresses = addresses.sort((a, b) => {
        return a.priority - b.priority;
      });
      let j = 0;
      const conn = net.createConnection(25, addresses[j].exchange);
      const commands = [
        'helo ' + addresses[j].exchange,
        'mail from: <' + from_email + '>',
        'rcpt to: <' + email + '>'
      ];

      let i = 0;
      conn.setEncoding('ascii');
      conn.setTimeout(timeout);
      conn.on('error', () => {
        conn.emit('false');
      });
      conn.on('false', () => {
        conn.removeAllListeners();
        conn.destroy();
        return callback(null, false);
      });
      conn.on('connect', () => {
        console.warn('connected');

        conn.on('prompt', () => {
          if (i < 3) {
            conn.write(commands[i]);
            conn.write('\r\n');
            i++;
          } else {
            conn.removeAllListeners();
            conn.destroy();
            return callback(null, true);
          }
        });
        conn.on('undetermined', () => {
          j++;
          conn.removeAllListeners();
          conn.destroy();
          return callback(null, false);
        });
        conn.on('timeout', () => {
          conn.emit('undetermined');
        });
        conn.on('data', data => {
          console.warn('should data', data);

          if (
            data.indexOf('220') == 0 ||
            data.indexOf('250') == 0 ||
            data.indexOf('\n220') != -1 ||
            data.indexOf('\n250') != -1
          ) {
            conn.emit('prompt');
          } else if (data.indexOf('\n550') != -1 || data.indexOf('550') == 0) {
            conn.emit('false');
          } else {
            conn.emit('undetermined');
          }
        });
      });
    });
  } catch (error) {
    Logger.error(error);
    return callback(null, false);
  }
};