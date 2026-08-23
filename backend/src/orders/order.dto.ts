import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderLineDto {
  @Type(() => Number)
  @IsInt()
  productId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  payment: string;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderLineDto)
  items?: CreateOrderLineDto[];
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  payment?: string;

  @IsOptional()
  @IsIn(['preparando', 'em trânsito', 'entregue', 'cancelado'])
  status?: 'preparando' | 'em trânsito' | 'entregue' | 'cancelado';
}

export const CANCEL_REASONS = [
  'changed_mind',
  'wrong_item',
  'too_slow',
  'found_cheaper',
  'other',
] as const;

export class CancelOrderDto {
  @IsIn(CANCEL_REASONS)
  reason: (typeof CANCEL_REASONS)[number];

  @IsOptional()
  @IsString()
  @MaxLength(400)
  details?: string;
}

export class CreateOrderItemDto {
  @Type(() => Number)
  @IsInt()
  orderId: number;

  @Type(() => Number)
  @IsInt()
  productId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateOrderItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class ApplyItemDiscountDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  discount: number;
}
