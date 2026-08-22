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
} from '@nestjs/common';
import type {
  ApplyItemDiscountDto,
  CreateOrderItemDto,
  OrderItem,
  UpdateOrderItemDto,
} from './order-item';
import { OrdersService } from './orders.service';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query('orderId') orderId?: string): OrderItem[] {
    return this.ordersService.findAllItems(this.parseOrderId(orderId));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): OrderItem {
    return this.ordersService.findOneItem(id);
  }

  @Post()
  create(@Body() dto: CreateOrderItemDto): OrderItem {
    return this.ordersService.createItem(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderItemDto,
  ): OrderItem {
    return this.ordersService.updateItem(id, dto);
  }

  @Patch(':id/discount')
  applyDiscount(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApplyItemDiscountDto,
  ): OrderItem {
    return this.ordersService.applyItemDiscount(id, dto.discount);
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
