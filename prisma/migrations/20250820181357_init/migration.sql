-- CreateEnum
CREATE TYPE "public"."filmesGender" AS ENUM ('ACAO', 'AVENTURA', 'COMEDIA', 'DRAMA', 'FICCAO', 'TERROR', 'ROMANCE', 'FANTASIA', 'MUSICAL', 'DOCUMENTARIO');

-- CreateTable
CREATE TABLE "public"."Filmes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "gender" "public"."filmesGender" NOT NULL,
    "releaser" TEXT NOT NULL,
    "images" JSONB[],

    CONSTRAINT "Filmes_pkey" PRIMARY KEY ("id")
);
