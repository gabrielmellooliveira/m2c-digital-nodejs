export const getPostgresConfigs = () => {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || String(),
    port: process.env.POSTGRES_PORT || String(),
    username: process.env.POSTGRES_USER || String(),
    password: process.env.POSTGRES_PASSWORD || String(),
    database: 'm2c_digital_db',
    synchronize: true,
    autoLoadEntities: true,
  };
};