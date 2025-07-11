import { Response, NextFunction } from 'express';
import { Op, Transaction } from 'sequelize';
import { sequelize } from '../config/database';
import Admin from '../models/Admin';
import User from '../models/User';
import ApiResponse from '../utils/apiResponse';
import {
  TypedRequest,
  PaginationQuery,
  IdParams,
  AdminCreateBody,
  AdminUpdateBody,
  SearchQuery
} from '../types/express';
import { AppError } from '../error/models/AppError';
import { ErrorCode } from '../error/constants/errorCodes';
import { ErrorMessage } from '../error/constants/errorMessages';

const AdminController = {
  // List all admins
  getAllAdmins: async (req: TypedRequest<{}, any, any, PaginationQuery & SearchQuery>, res: Response, next?: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page ?? '1');
      const limit = parseInt(req.query.limit ?? '10');
      const search = req.query.search ?? '';
      const offset = (page - 1) * limit;
      const whereClause = search ? {
        [Op.or]: [
          { '$user.username$': { [Op.iLike]: `%${search}%` } },
          { '$user.email$': { [Op.iLike]: `%${search}%` } },
          { '$user.firstName$': { [Op.iLike]: `%${search}%` } },
          { '$user.lastName$': { [Op.iLike]: `%${search}%` } },
          { department: { [Op.iLike]: `%${search}%` } },
          { title: { [Op.iLike]: `%${search}%` } }
        ]
      } : {};

      const { count, rows: admins } = await Admin.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['username', 'email', 'role', 'firstName', 'lastName']
          }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      ApiResponse.pagination(res, admins, page, limit, count);
    } catch (error) {
      if (next) {
        next(error);
      } else if (error instanceof AppError) {
          ApiResponse.error(res, error.message, error.statusCode, { code: error.errorCode });
        } else {
          ApiResponse.error(res, error instanceof Error ? error.message : ErrorMessage.GENERIC_ERROR.tr, 500);
        }
    }
  },

  // Get admin details by ID
  getAdminById: async (req: TypedRequest<IdParams>, res: Response, next?: NextFunction): Promise<void> => {
    try {
      const admin = await Admin.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['username', 'email', 'role', 'firstName', 'lastName']
          }
        ]
      });

      if (!admin) {
        throw new AppError(ErrorMessage.NOT_FOUND.tr, 404, ErrorCode.NOT_FOUND);
      }

      ApiResponse.success(res, admin);
    } catch (error) {
      if (next) {
        next(error);
      } else if (error instanceof AppError) {
          ApiResponse.error(res, error.message, error.statusCode, { code: error.errorCode });
        } else {
          ApiResponse.error(res, error instanceof Error ? error.message : 'Yönetici bilgileri alınırken bir hata oluştu', 500);
        }
    }
  },

  // Create a new admin
  createAdmin: async (req: TypedRequest<{}, any, AdminCreateBody>, res: Response, next?: NextFunction): Promise<void> => {
    try {
      const { username, email, password, firstName, lastName, department, title } = req.body;
      const user = await User.create({
        username,
        email,
        password,
        role: 'admin',
        firstName,
        lastName
      } as any);

      const admin = await Admin.create({
        userId: user.id,
        department,
        title
      } as any);

      ApiResponse.success(res, { user, admin }, 'Yönetici başarıyla oluşturuldu', 201);
    } catch (error) {
      if (next) {
        next(error);
      } else if (error instanceof AppError) {
          ApiResponse.error(res, error.message, error.statusCode, { code: error.errorCode });
        } else {
          ApiResponse.error(res, error instanceof Error ? error.message : 'Yönetici oluşturulurken bir hata oluştu', 500);
        }
    }
  },
  // Update admin details
  updateAdmin: async (req: TypedRequest<IdParams, any, AdminUpdateBody>, res: Response, next?: NextFunction): Promise<void> => {
    try {
      const { firstName, lastName, department, title } = req.body;
      const admin = await Admin.findByPk(req.params.id);

      if (!admin) {
        throw new AppError(ErrorMessage.NOT_FOUND.tr, 404, ErrorCode.NOT_FOUND);
      }

      const user = await User.findByPk(admin.userId);
      await user?.update({
        firstName,
        lastName
      });

      await admin.update({
        department,
        title
      });

      ApiResponse.success(res, { admin, user }, 'Yönetici başarıyla güncellendi');
    } catch (error) {
      if (next) {
        next(error);
      } else if (error instanceof AppError) {
          ApiResponse.error(res, error.message, error.statusCode, { code: error.errorCode });
        } else {
          ApiResponse.error(res, error instanceof Error ? error.message : 'Yönetici güncellenirken bir hata oluştu', 500);
        }
    }
  },

  // Delete an admin
  deleteAdmin: async (req: TypedRequest<IdParams>, res: Response, next?: NextFunction): Promise<void> => {
    try {
      const admin = await Admin.findByPk(req.params.id);

      if (!admin) {
        throw new AppError(ErrorMessage.NOT_FOUND.tr, 404, ErrorCode.NOT_FOUND);
      }

      await sequelize.transaction(async (t: Transaction) => {
        await admin.destroy({ transaction: t });

        await User.destroy({
          where: { id: admin.userId },
          transaction: t
        });
      });

      ApiResponse.success(res, null, 'Yönetici başarıyla silindi');
    } catch (error) {
      if (next) {
        next(error);
      } else if (error instanceof AppError) {
          ApiResponse.error(res, error.message, error.statusCode, { code: error.errorCode });
        } else {
          ApiResponse.error(res, error instanceof Error ? error.message : 'Yönetici silinirken bir hata oluştu', 500);
        }
    }
  }
};

export default AdminController;