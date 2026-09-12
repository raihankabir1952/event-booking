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
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  // ==============================
  // INITIATE PAYMENT
  // ==============================
  @Post('initiate')
  initiatePayment(
    @Body('bookingId') bookingId: number,
  ) {
    return this.paymentsService.initiatePayment(
      bookingId,
    );
  }

  // ==============================
  // PAYMENT SUCCESS - GET
  // ==============================
  @Get('success')
  async paymentSuccessGet(
    @Query() query: any,
    @Res() res: Response,
  ) {
    console.log(
      'Payment Success GET Query:',
      query,
    );

    const valId = query.val_id;

    if (valId) {
      try {
        // Validate payment with SSLCommerz
        const validationResult =
          await this.paymentsService.validatePayment(
            valId,
          );

        console.log(
          'GET Validation Result:',
          validationResult,
        );

        // Check payment status
        if (
          validationResult.status === 'VALID' ||
          validationResult.status === 'VALIDATED'
        ) {
          // Mark booking as PAID
          const booking =
            await this.paymentsService.completePayment(
              validationResult.tran_id,
              Number(validationResult.amount),
            );

          console.log(
            'Payment completed successfully:',
            booking.id,
          );

          // Redirect to frontend success page
          return res.redirect(
            'https://event-booking-1opb.vercel.app/payment/success',
          );
        }

        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Payment Validation Failed</title>
            </head>

            <body>
              <h1>Payment Validation Failed ❌</h1>
              <p>
                Status: ${validationResult.status}
              </p>
            </body>
          </html>
        `);
      } catch (error) {
        console.error(
          'GET Payment Processing Error:',
          error,
        );

        return res.status(500).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Payment Error</title>
            </head>

            <body>
              <h1>Payment Processing Error ❌</h1>
              <p>
                Unable to process payment.
              </p>
            </body>
          </html>
        `);
      }
    }

    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Error</title>
        </head>

        <body>
          <h1>Payment Error ❌</h1>
          <p>
            Validation ID was not received.
          </p>
        </body>
      </html>
    `);
  }

  // ==============================
  // PAYMENT SUCCESS - POST
  // ==============================
  @Post('success')
  async paymentSuccessPost(
    @Body() paymentData: any,
    @Res() res: Response,
  ) {
    console.log(
      'Payment Success POST Data:',
      paymentData,
    );

    const valId = paymentData.val_id;

    if (!valId) {
      return res.status(400).send(`
        <h1>Payment Error ❌</h1>
        <p>Validation ID was not received.</p>
      `);
    }

    try {
      const validationResult =
        await this.paymentsService.validatePayment(
          valId,
        );

      console.log(
        'SSLCOMMERZ Validation Result:',
        validationResult,
      );

      if (
        validationResult.status === 'VALID' ||
        validationResult.status === 'VALIDATED'
      ) {
        const booking =
          await this.paymentsService.completePayment(
            validationResult.tran_id,
            Number(validationResult.amount),
          );

        console.log(
          'Payment completed successfully:',
          booking.id,
        );

        return res.redirect(
          'https://event-booking-1opb.vercel.app/payment/success',
        );
      }

      return res.status(400).send(`
        <h1>Payment Validation Failed ❌</h1>
        <p>Status: ${validationResult.status}</p>
      `);
    } catch (error) {
      console.error(
        'Payment Completion Error:',
        error,
      );

      return res.status(500).send(`
        <h1>Payment Processing Error ❌</h1>
        <p>Unable to complete payment.</p>
      `);
    }
  }

  // ==============================
  // IPN
  // ==============================
  @Post('ipn')
  async paymentIPN(
    @Body() paymentData: any,
  ) {
    console.log(
      'SSLCOMMERZ IPN Data:',
      paymentData,
    );

    const valId = paymentData.val_id;

    if (!valId) {
      return {
        status: 'FAILED',
        message: 'Validation ID not received',
      };
    }

    try {
      const validationResult =
        await this.paymentsService.validatePayment(
          valId,
        );

      console.log(
        'IPN Validation Result:',
        validationResult,
      );

      if (
        validationResult.status === 'VALID' ||
        validationResult.status === 'VALIDATED'
      ) {
        const booking =
          await this.paymentsService.completePayment(
            validationResult.tran_id,
            Number(validationResult.amount),
          );

        console.log(
          'Booking marked as PAID:',
          booking.id,
        );

        return {
          status: 'SUCCESS',
          bookingId: booking.id,
          transactionId:
            validationResult.tran_id,
        };
      }

      return {
        status: 'FAILED',
        paymentStatus:
          validationResult.status,
      };
    } catch (error) {
      console.error(
        'IPN Payment Processing Error:',
        error,
      );

      return {
        status: 'FAILED',
        message: 'Payment processing failed',
      };
    }
  }

  // ==============================
  // PAYMENT FAIL - GET
  // ==============================
  @Get('fail')
  paymentFail(
    @Query() query: any,
    @Res() res: Response,
  ) {
    console.log(
      'Payment Failed:',
      query,
    );

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Failed</title>
        </head>

        <body>
          <h1>Payment Failed ❌</h1>
          <p>
            Your payment was not completed.
          </p>
        </body>
      </html>
    `);
  }

  // ==============================
  // PAYMENT FAIL - POST
  // ==============================
  @Post('fail')
  paymentFailPost(
    @Body() paymentData: any,
    @Res() res: Response,
  ) {
    console.log(
      'Payment Failed POST:',
      paymentData,
    );

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Failed</title>
        </head>

        <body>
          <h1>Payment Failed ❌</h1>
          <p>
            Your payment was not completed.
          </p>
        </body>
      </html>
    `);
  }

  // ==============================
  // PAYMENT CANCEL - GET
  // ==============================
  @Get('cancel')
  paymentCancel(
    @Query() query: any,
    @Res() res: Response,
  ) {
    console.log(
      'Payment Cancelled:',
      query,
    );

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Cancelled</title>
        </head>

        <body>
          <h1>Payment Cancelled ⚠️</h1>
          <p>
            You cancelled the payment.
          </p>
        </body>
      </html>
    `);
  }

  // ==============================
  // PAYMENT CANCEL - POST
  // ==============================
  @Post('cancel')
  paymentCancelPost(
    @Body() paymentData: any,
    @Res() res: Response,
  ) {
    console.log(
      'Payment Cancelled POST:',
      paymentData,
    );

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Cancelled</title>
        </head>

        <body>
          <h1>Payment Cancelled ⚠️</h1>
          <p>
            You cancelled the payment.
          </p>
        </body>
      </html>
    `);
  }

  // ==============================
  // TEST VALIDATION
  // ==============================
  @Get('validate')
  validatePayment() {
    return this.paymentsService.validatePayment(
      'TEST_VAL_ID',
    );
  }
}