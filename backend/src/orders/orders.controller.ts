import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import type { CreateOrderDto, OrderWithItems, UpdateOrderDto } from './order';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Promise<OrderWithItems[]> {
    return this.ordersService.findAllOrders();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderWithItems> {
    return this.ordersService.findOneOrder(id);
  }

  @Post()
  create(@Body() dto: CreateOrderDto): Promise<OrderWithItems> {
    return this.ordersService.createOrder(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderWithItems> {
    return this.ordersService.updateOrder(id, dto);
  }
}
