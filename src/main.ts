import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
const app = await NestFactory.create(AppModule);

// Configurações da documentação Swagger
const config = new DocumentBuilder()
    .setTitle('API de Filmes')
    .setDescription('Documentação da API de Filmes com NestJS + Prisma + Swagger')
    .setVersion('1.0')
    .addTag('filmes') // Tag opcional para categorizar as rotas
    .build();

    app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true, // Remove propriedades não decoradas no DTO
          forbidNonWhitelisted: true, // Retorna erro se enviar propriedades não permitidas
          transform: true, // Transforma os tipos automaticamente (ex: string para number)
        })
      );

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document); // Acessível em http://localhost:3000/api

await app.listen(3001);
}
bootstrap();