import { Module } from '@nestjs/common';
import { OrderItemsController } from './order-items.controller';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController, OrderItemsController],
  providers: [OrdersService],
})
export class OrdersModule {}
