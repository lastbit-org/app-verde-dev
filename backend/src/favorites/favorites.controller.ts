import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Product } from '../products/product';
import type { User } from '../users/user';
import { FavoriteProductDto } from '../users/user.dto';
import { FavoritesService } from './favorites.service';

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: User): Promise<Product[]> {
    return this.favoritesService.list(user.id);
  }

  @Get('ids')
  ids(@CurrentUser() user: User): Promise<number[]> {
    return this.favoritesService.ids(user.id);
  }

  @Post()
  add(
    @CurrentUser() user: User,
    @Body() dto: FavoriteProductDto,
  ): Promise<Product> {
    return this.favoritesService.add(user.id, dto.productId);
  }

  @Delete(':productId')
  @HttpCode(204)
  remove(
    @CurrentUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    return this.favoritesService.remove(user.id, productId);
  }
}
