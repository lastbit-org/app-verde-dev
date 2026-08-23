import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { User } from '../users/user';
import type { CreateOrderDto, OrderWithItems, UpdateOrderDto } from './order';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@CurrentUser() user: User): Promise<OrderWithItems[]> {
    return this.ordersService.findAllOrders(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<OrderWithItems> {
    return this.ordersService.requireOwnedOrder(id, user.id);
  }

  @Post()
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: User,
  ): Promise<OrderWithItems> {
    return this.ordersService.createOrder({ ...dto, userId: user.id });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
    @CurrentUser() user: User,
  ): Promise<OrderWithItems> {
    await this.ordersService.requireOwnedOrder(id, user.id);
    return this.ordersService.updateOrder(id, dto);
  }
}
