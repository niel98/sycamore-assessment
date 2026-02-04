import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TransferDto {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  fromWalletId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  toWalletId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  amount: number;
}
