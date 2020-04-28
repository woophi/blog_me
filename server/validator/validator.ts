import { Request, Response, NextFunction } from 'express-serve-static-core';
import { HTTPStatus } from 'server/lib/models';
import { Types } from 'mongoose';

export class Validator {
  constructor(req?: Request, res?: Response) {
    this.req = req;
    this.res = res;
  }
  req: Request = null;
  res: Response = null;

  check = async (
    requires: {
      [key: string]: any;
    },
    data: {
      [key: string]: any;
    }
  ) => {
    return new Promise(resolve => {
      const requireKeys = Object.keys(requires);
      let errors = {};
      requireKeys.forEach(k => {
        const invalid = requires[k](data[k]);
        if (invalid) errors[k] = invalid;
      });

      if (!this.isEmpty(errors)) {
        return this.Exception(errors, HTTPStatus.BadRequest);
      }
      return resolve();
    });
  };

  private Exception = <T>(error: T, code: HTTPStatus) => {
    if (error && this.res) {
      return this.res.status(code).send({ error: error });
    }
    return error;
  };

  required = <T>(value: T) => {
    if (!value || (typeof value === 'string' && value.indexOf('undefined') !== -1)) {
      const err = 'required';
      return err;
    }
  };

  isEmail = (email: string) => {
    const err = 'email is invalid';
    if (!email || !this.typeOfString(email)) {
      return err;
    }
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email.toLowerCase())) {
      return err;
    }
  };

  typeOfString = <T>(value: T) => {
    return typeof value === 'string';
  };

  typeOfNumber = <T>(value: T) => {
    const required = this.required(value);
    if (required) return required;
    if (typeof Number(value) !== 'number' || isNaN(Number(value))) {
      return 'invalid format';
    }
  };

  isEmpty = <T>(value: T) => {
    const empty = 'empty';
    if (!value) {
      return empty;
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      for (let key in value) {
        if (value.hasOwnProperty(key)) {
          return;
        }
      }
      return empty;
    }
    if (Array.isArray(value) && !value.length) {
      return empty;
    }
    if (typeof value !== 'object' && !Array.isArray(value)) {
      return empty;
    }
    return;
  };

  notIsEmpty = <T>(value: T) => {
    const empty = this.isEmpty(value);
    if (empty) {
      return empty;
    }
  };

  notMongooseObject = <T>(value: T) => {
    const required = this.required(value);
    if (required) return required;
    if (!Types.ObjectId.isValid(value as any)) {
      return 'invalid';
    }
  };

  maxLength = (maxLength: number) => <T>(value: T) => {
    const required = this.required(value);
    if (required) return required;
    if (typeof value === 'string' && value.length > maxLength) {
      return 'increased allowed length';
    }
  };
}
