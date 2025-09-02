import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FilmesModule } from './filmes/filmes.module';


@Module({
  imports: [UserModule, PrismaModule, AuthModule, FilmesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}