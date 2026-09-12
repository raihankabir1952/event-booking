import {
  Controller,
  Get,
  Post,
  Res,
  Query,
  Body,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import type { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Start Payment
  @Post('initiate')
  initiatePayment() {
    return this.paymentsService.initiatePayment();
  }

  // SSLCOMMERZ Success - GET
  @Get('success')
  paymentSuccessGet(
    @Query() query: any,
    @Res() res: Response,
  ) {
    console.log('Payment Success GET Query:', query);

    return res.send(`
      <h1>Payment Successful</h1>
      <p>GET callback received.</p>
    `);
  }

  // SSLCOMMERZ Success - POST
  @Post('success')
  paymentSuccessPost(
    @Body() paymentData: any,
    @Res() res: Response,
  ) {
    console.log('Payment Success POST Data:', paymentData);

    return res.send(`
      <h1>Payment Successful</h1>
      <p>POST callback received.</p>
      <p>Check your backend terminal for payment data.</p>
    `);
  }

  // Temporary validation test endpoint
  @Get('validate')
  validatePayment() {
    return this.paymentsService.validatePayment('TEST_VAL_ID');
  }
}
