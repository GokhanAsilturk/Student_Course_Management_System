import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV ?? 'development';

const createTestConnection = () => {
  return new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
};

const createNormalConnection = () => {
  // Önce DATABASE_URL varsa onu kullan
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
    });
  }
    // Eğer DATABASE_URL yoksa ayrı ayrı değişkenleri kullan
  return new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER ?? process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? process.env.POSTGRES_PASSWORD ?? '1234',
    database: process.env.DB_NAME ?? process.env.POSTGRES_DB ?? 'yedt_case',
    logging: false,
  });
};

export const sequelize = env === 'test'
  ? createTestConnection()
  : createNormalConnection();
