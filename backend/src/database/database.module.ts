import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from '../orders/order-item.entity';
import { OrderCancellationEntity } from '../orders/order-cancellation.entity';
import { OrderEntity } from '../orders/order.entity';
import { ProductEntity } from '../products/product.entity';
import { AddressEntity } from '../addresses/address.entity';
import { FavoriteEntity } from '../favorites/favorite.entity';
import { UserEntity } from '../users/user.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const connectionName = config
          .get<string>('CLOUD_SQL_CONNECTION_NAME')
          ?.trim();
        const common = {
          type: 'postgres' as const,
          username: config.get<string>('DATABASE_USER') ?? 'verde',
          password: config.get<string>('DATABASE_PASSWORD') ?? 'verde',
          database: config.get<string>('DATABASE_NAME') ?? 'ecommerce',
          autoLoadEntities: true,
          synchronize:
            (config.get<string>('DATABASE_SYNC') ?? 'true') !== 'false',
        };

        if (connectionName) {
          return {
            ...common,
            host: `/cloudsql/${connectionName}`,
          };
        }

        return {
          ...common,
          host: config.get<string>('DATABASE_HOST') ?? 'localhost',
          port: Number(config.get<string>('DATABASE_PORT') ?? 5432),
        };
      },
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      ProductEntity,
      OrderEntity,
      OrderItemEntity,
      OrderCancellationEntity,
      AddressEntity,
      FavoriteEntity,
    ]),
  ],
  providers: [SeedService],
})
export class DatabaseModule {}
