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

  // =========================
  // Start Payment
  // =========================
  @Post('initiate')
  initiatePayment(
    @Body('bookingId') bookingId: number,
  ) {
    return this.paymentsService.initiatePayment(
      bookingId,
    );
  }

  // =========================
  // Payment Success - GET
  // =========================
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

    // If SSLCOMMERZ sends val_id
    if (valId) {
      try {
        const validationResult =
          await this.paymentsService.validatePayment(
            valId,
          );

        console.log(
          'GET Validation Result:',
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

          return res.send(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Payment Successful</title>
              </head>

              <body>
                <h1>Payment Successful ✅</h1>

                <p>
                  <strong>Booking ID:</strong>
                  ${booking.id}
                </p>

                <p>
                  <strong>Transaction ID:</strong>
                  ${validationResult.tran_id}
                </p>

                <p>
                  <strong>Amount:</strong>
                  ${validationResult.amount} BDT
                </p>

                <p>
                  <strong>Payment Status:</strong>
                  PAID
                </p>

                <p>
                  Confirmation email has been sent.
                </p>
              </body>
            </html>
          `);
        }

        return res.status(400).send(`
          <h1>Payment Validation Failed ❌</h1>
          <p>Status: ${validationResult.status}</p>
        `);
      } catch (error) {
        console.error(
          'GET Payment Processing Error:',
          error,
        );

        return res.status(500).send(`
          <h1>Payment Processing Error ❌</h1>
          <p>Unable to process payment.</p>
        `);
      }
    }

    // No val_id received
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Received</title>
        </head>

        <body>
          <h1>Payment Received ✅</h1>

          <p>
            Your payment request was received.
          </p>

          <p>
            Payment verification is being processed.
          </p>
        </body>
      </html>
    `);
  }

  // =========================
  // Payment Success - POST
  // =========================
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

        return res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Payment Successful</title>
            </head>

            <body>
              <h1>Payment Successful ✅</h1>

              <p>
                <strong>Booking ID:</strong>
                ${booking.id}
              </p>

              <p>
                <strong>Transaction ID:</strong>
                ${validationResult.tran_id}
              </p>

              <p>
                <strong>Amount:</strong>
                ${validationResult.amount} BDT
              </p>

              <p>
                <strong>Payment Status:</strong>
                PAID
              </p>

              <p>
                Confirmation email has been sent.
              </p>
            </body>
          </html>
        `);
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

  // =========================
  // IPN
  // =========================
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

  // =========================
  // Payment Failed
  // =========================
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
      <h1>Payment Failed ❌</h1>
      <p>Your payment was not completed.</p>
    `);
  }

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
      <h1>Payment Failed ❌</h1>
      <p>Your payment was not completed.</p>
    `);
  }

  // =========================
  // Payment Cancelled
  // =========================
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
      <h1>Payment Cancelled ⚠️</h1>
      <p>You cancelled the payment.</p>
    `);
  }

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
      <h1>Payment Cancelled ⚠️</h1>
      <p>You cancelled the payment.</p>
    `);
  }

  // =========================
  // Temporary Validation Test
  // =========================
  @Get('validate')
  validatePayment() {
    return this.paymentsService.validatePayment(
      'TEST_VAL_ID',
    );
  }
}
