import { Module } from '@nestjs/common';
import { FilmesModule } from './filmes/filmes.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [FilmesModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}