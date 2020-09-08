const config = require('config');

const dbConfig = config.get('db');

module.exports = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  // entities: [__dirname + '/../**/*.entity.{js,ts}'],
  entities: ['dist/**/*.entity{ .ts,.js}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  logging: true,
  // migrations: ['src/database/migrations/**/*.ts'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  cli: {
    entitiesDir: __dirname + '/../**/*.entity.{js,ts}',
    migrationsDir: 'src/database/migrations/'
  },
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
}
