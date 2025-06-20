import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../error/models/AppError';
import { ErrorCode } from '../error/constants/errorCodes';

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

type SchemaType = Record<string, Joi.Schema>;

export interface ValidationSchema {
  body?: SchemaType;
  query?: SchemaType;
  params?: SchemaType;
}

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: string[] = [];

    if (schema.body) {
      const { error } = Joi.object(schema.body).validate(req.body, { abortEarly: false });
      
      if (error) {
        validationErrors.push(...error.details.map(detail => detail.message));
      }
    }

    if (schema.query) {
      const { error } = Joi.object(schema.query).validate(req.query, { abortEarly: false });
      
      if (error) {
        validationErrors.push(...error.details.map(detail => detail.message));
      }
    }

    if (schema.params) {
      const { error } = Joi.object(schema.params).validate(req.params, { abortEarly: false });
      
      if (error) {
        validationErrors.push(...error.details.map(detail => detail.message));
      }
    }

    if (validationErrors.length > 0) {
      throw new AppError(
        `Doğrulama hatası: ${validationErrors.join(', ')}`,
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    next();
  };
};

export const commonSchemas = {
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Geçersiz ID formatı. UUID olmalıdır.',
    'any.required': 'ID alanı zorunludur.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Geçersiz e-posta adresi formatı.',
    'any.required': 'E-posta alanı zorunludur.'
  }),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required().messages({
    'string.min': 'Şifre en az 8 karakter uzunluğunda olmalıdır.',
    'string.pattern.base': 'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.',
    'any.required': 'Şifre alanı zorunludur.'
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Kullanıcı adı sadece harf ve rakam içermelidir.',
    'string.min': 'Kullanıcı adı en az 3 karakter uzunluğunda olmalıdır.',
    'string.max': 'Kullanıcı adı en fazla 30 karakter uzunluğunda olmalıdır.',
    'any.required': 'Kullanıcı adı alanı zorunludur.'
  }),
  pagination: {
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Sayfa numarası bir sayı olmalıdır.',
      'number.integer': 'Sayfa numarası bir tam sayı olmalıdır.',
      'number.min': 'Sayfa numarası en az 1 olmalıdır.'
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Limit bir sayı olmalıdır.',
      'number.integer': 'Limit bir tam sayı olmalıdır.',
      'number.min': 'Limit en az 1 olmalıdır.',
      'number.max': 'Limit en fazla 100 olmalıdır.'
    })
  }
};