// src/database/database.module.ts
import { Module } from '@nestjs/common';
import config from 'src/config';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; // 👈 import

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // 👈 use TypeOrmModule
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, host, dbName, password, port } = configService.postgres;
        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password,
          database: dbName,
          synchronize: false, // 👈 new attr
          autoLoadEntities: true, // 👈 new attr
        };
      },
    }),
  ],
  exports: [TypeOrmModule], // 👈 add in exports
})
export class DatabaseModule {}
