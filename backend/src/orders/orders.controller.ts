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
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { isAdmin } from '../users/roles';
import type { User } from '../users/user';
import { CreateOrderDto, CancelOrderDto, UpdateOrderDto } from './order.dto';
import type { OrderWithItems } from './order';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@CurrentUser() user: User): Promise<OrderWithItems[]> {
    if (isAdmin(user.role)) {
      return this.ordersService.findAllOrders();
    }

    return this.ordersService.findAllOrders(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<OrderWithItems> {
    return this.ordersService.requireOrderAccess(id, user);
  }

  @Post()
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: User,
  ): Promise<OrderWithItems> {
    return this.ordersService.createOrder(user.id, dto);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelOrderDto,
    @CurrentUser() user: User,
  ): Promise<OrderWithItems> {
    return this.ordersService.cancelOrder(id, user, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderWithItems> {
    return this.ordersService.updateOrder(id, dto);
  }
}
