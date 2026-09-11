// import { NestFactory } from '@nestjs/core';        
// import { AppModule } from './app.module';         
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors();  // CORS enable 

//   // Global validation
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,              // Ignore extra fields
//     forbidNonWhitelisted: true,   // Throw error on extra fields
//   }));
  
//   await app.listen(4000);
// }
// bootstrap();

//for deployment
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT || 4000);
}

bootstrap();
