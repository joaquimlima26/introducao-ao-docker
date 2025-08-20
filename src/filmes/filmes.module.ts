import { Module } from '@nestjs/common';
import { FilmesService } from './filmes.service';
import { FilmesController } from './filmes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [PrismaModule],
  providers: [FilmesService, CloudinaryService],
  controllers: [FilmesController]
})
export class FilmesModule {}