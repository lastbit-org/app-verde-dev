import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import type { User } from '../users/user';
import type { OrderItem } from './order-item';
import {
  ApplyItemDiscountDto,
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from './order.dto';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard)
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('orderId') orderId?: string,
  ): Promise<OrderItem[]> {
    return this.ordersService.findAllItems(this.parseOrderId(orderId), user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<OrderItem> {
    return this.ordersService.requireOwnedItem(id, user);
  }

  @Post()
  create(
    @Body() dto: CreateOrderItemDto,
    @CurrentUser() user: User,
  ): Promise<OrderItem> {
    return this.ordersService.createItem(dto, user);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderItemDto,
    @CurrentUser() user: User,
  ): Promise<OrderItem> {
    return this.ordersService.updateItem(id, dto, user);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id/discount')
  applyDiscount(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApplyItemDiscountDto,
    @CurrentUser() user: User,
  ): Promise<OrderItem> {
    return this.ordersService.applyItemDiscount(id, dto.discount, user);
  }

  private parseOrderId(orderId?: string) {
    if (orderId === undefined || orderId === '') {
      return undefined;
    }

    const parsed = Number(orderId);

    if (!Number.isInteger(parsed)) {
      throw new BadRequestException('orderId must be an integer');
    }

    return parsed;
  }
}
