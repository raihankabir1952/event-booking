import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  async initiatePayment() {
    try {
      const storeId = process.env.SSLCOMMERZ_STORE_ID;
      const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
      const apiUrl = process.env.SSLCOMMERZ_API_URL;

      const transactionId = `TXN_${Date.now()}`;

      const paymentData = {
        store_id: storeId,
        store_passwd: storePassword,
        total_amount: 100,
        currency: 'BDT',
        tran_id: transactionId,

        success_url:
          'https://event-booking-backend-8eg9.onrender.com/payments/success',

        fail_url:
          'https://event-booking-backend-8eg9.onrender.com/payments/fail',

        cancel_url:
          'https://event-booking-backend-8eg9.onrender.com/payments/cancel',

        product_name: 'Event Booking',
        product_category: 'Event',
        product_profile: 'general',

        cus_name: 'Test Customer',
        cus_email: 'test@example.com',
        cus_add1: 'Dhaka',
        cus_city: 'Dhaka',
        cus_country: 'Bangladesh',
        cus_phone: '01700000000',

        shipping_method: 'NO',
      };

      const response = await axios.post(apiUrl!, paymentData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error) {
      console.error('SSLCOMMERZ Payment Error:', error);

      throw new InternalServerErrorException(
        'Unable to initiate payment',
      );
    }
  }

  async validatePayment(valId: string) {
    try {
      const storeId = process.env.SSLCOMMERZ_STORE_ID;
      const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;

      const response = await axios.get(
        'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php',
        {
          params: {
            val_id: valId,
            store_id: storeId,
            store_passwd: storePassword,
            v: 1,
            format: 'json',
          },
        },
      );

      console.log('Payment Validation Response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Payment Validation Error:', error);

      throw new InternalServerErrorException(
        'Unable to validate payment',
      );
    }
  }
}