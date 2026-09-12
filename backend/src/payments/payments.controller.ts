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
  async paymentSuccessPost(
    @Body() paymentData: any,
    @Res() res: Response,
  ) {
    console.log('Payment Success POST Data:', paymentData);

    const valId = paymentData.val_id;

    // Check val_id
    if (!valId) {
      return res.status(400).send(`
        <h1>Payment Error</h1>
        <p>Validation ID was not received.</p>
      `);
    }

    try {
      // Validate payment directly with SSLCOMMERZ
      const validationResult =
        await this.paymentsService.validatePayment(valId);

      console.log(
        'SSLCOMMERZ Validation Result:',
        validationResult,
      );

      // Payment successfully validated
      if (validationResult.status === 'VALIDATED' ||
         validationResult.status === 'VALIDATED'
      ) {
        return res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Payment Successful</title>
            </head>

            <body>
              <h1>Payment Successful ✅</h1>

              <p>
                <strong>Transaction ID:</strong>
                ${validationResult.tran_id}
              </p>

              <p>
                <strong>Amount:</strong>
                ${validationResult.amount} BDT
              </p>

              <p>
                <strong>Status:</strong>
                ${validationResult.status}
              </p>
            </body>
          </html>
        `);
      }

      // Validation failed
      return res.status(400).send(`
        <h1>Payment Validation Failed ❌</h1>
        <p>Status: ${validationResult.status}</p>
      `);

    } catch (error) {
      console.error(
        'Payment Validation Error:',
        error,
      );

      return res.status(500).send(`
        <h1>Payment Validation Error</h1>
        <p>Unable to validate payment.</p>
      `);
    }
  }

  // Temporary validation test endpoint
  @Get('validate')
  validatePayment() {
    return this.paymentsService.validatePayment('TEST_VAL_ID');
  }
}
