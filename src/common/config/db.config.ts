import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const db_config = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('MYSQL_HOST') || 'localhost',
  port: configService.get<number>('MYSQL_PORT') || 3306,
  username: configService.get<string>('MYSQL_USER_NAME'),
  password: configService.get<string>('MYSQL_PASSWORD'),
  database: configService.get<string>('MYSQL_DB_NAME') || 'land_collector',
  synchronize: configService.get<string>('STAGE') !== 'production',
  charset: 'utf8mb4_unicode_ci',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  logging: false,
  entities: [`dist/**/entities/*.{ts,js}`],
  migrations: [`${__dirname}/../**/migrations/*.{ts,js}`],
  subscribers: [`${__dirname}/../**/subscribers/*.{ts,js}`],
  cli: {
    entitiesDir: `dist/**/entities/*.{ts,js}`,
    migrationsDir: `${__dirname}/../**/migrations/*.{ts,js}`,
    subscribersDir: `${__dirname}/../**/subscribers/*.{ts,js}`,
  },
  namingStrategy: new SnakeNamingStrategy(),
  autoLoadEntities: true,
});
