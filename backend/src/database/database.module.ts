import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from '../orders/order-item.entity';
import { OrderEntity } from '../orders/order.entity';
import { ProductEntity } from '../products/product.entity';
import { UserEntity } from '../users/user.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DATABASE_HOST') ?? 'localhost',
        port: Number(config.get<string>('DATABASE_PORT') ?? 5432),
        username: config.get<string>('DATABASE_USER') ?? 'verde',
        password: config.get<string>('DATABASE_PASSWORD') ?? 'verde',
        database: config.get<string>('DATABASE_NAME') ?? 'ecommerce',
        autoLoadEntities: true,
        synchronize: (config.get<string>('DATABASE_SYNC') ?? 'true') !== 'false',
      }),
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      ProductEntity,
      OrderEntity,
      OrderItemEntity,
    ]),
  ],
  providers: [SeedService],
})
export class DatabaseModule {}
