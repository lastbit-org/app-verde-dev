import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../auth/roles.guard';
import { ProductEntity } from '../products/product.entity';
import { OrderItemsController } from './order-items.controller';
import { OrderItemEntity } from './order-item.entity';
import { OrderEntity } from './order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ProductEntity]),
  ],
  controllers: [OrdersController, OrderItemsController],
  providers: [OrdersService, RolesGuard],
})
export class OrdersModule {}
