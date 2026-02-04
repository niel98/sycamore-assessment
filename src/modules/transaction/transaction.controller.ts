import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransferDto } from './dto/transfer.dto';

@Controller('transfer')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async transfer(@Body() dto: TransferDto) {
    return this.transactionService.transfer(
      dto.reference,
      dto.fromWalletId,
      dto.toWalletId,
      dto.amount,
    );
  }
}
