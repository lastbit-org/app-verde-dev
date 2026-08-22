import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import type { ApplyDiscountDto, CreateProductDto, Product } from './product';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Product[] {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Product {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto): Product {
    return this.productsService.create(dto);
  }

  @Patch(':id/discount')
  applyDiscount(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApplyDiscountDto,
  ): Product {
    return this.productsService.applyDiscount(id, dto.discount);
  }
}
