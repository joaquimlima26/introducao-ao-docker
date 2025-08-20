import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFilmesDTO } from './dto/create-filmes.dto';
import { Filmes, Prisma } from '@prisma/client';
import { ImageObject } from './types/image-object';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class FilmesService {
    constructor(private prisma: PrismaService, private cloudinary: CloudinaryService){}
    
    async create(data: Prisma.FilmesCreateInput){
        return await this.prisma.filmes.create({data})
    }

    async getAllFilmes(){
        const foundFilm = await this.prisma.filmes.findMany()

        if(!foundFilm){
            throw new BadRequestException(
                `Nenhum Filme encontrado`
            )
        }

        return foundFilm
        
    }
    
    async findById(id: string){
        const foundFilm = await this.prisma.filmes.findUnique({
            where: {id}
        })

        if(!foundFilm){
            throw new BadRequestException(
                `Nenhum Filme encontrado com ID ${id}`
            )
        }

        return foundFilm
    }

    async update(id: string, data: Partial<Filmes>, newImages?: Buffer[]): Promise<Filmes | null> {
        const found = await this.prisma.filmes.findUnique({
            where: {id}
        })

        if(!found){
            throw new BadRequestException(
                `Nenhum Filme encontado com esse ID ${id}`
            )
        }

        let images = found.images as ImageObject[]

        if(newImages && newImages.length > 0) {
            await Promise.all(images.map(img => this.cloudinary.deleteImage(img.public_id)));
      // Upload das novas imagens
            images = await Promise.all(newImages.map(file => this.cloudinary.uploadImage(file)));
        }

        return this.prisma.filmes.update({
            where: { id },
            data: {
              ...data,
              ...(newImages ? { images: JSON.parse(JSON.stringify(images)) } : {}),
            },
          });
    }

    async delete(id: string): Promise<void> {
        const found = await this.prisma.filmes.findUnique({
            where: {id}
        })

        if(!found){
            throw new BadRequestException(
                `Nenhum Filme encontado com esse ID ${id}`
            )
        }

        const images = found.images as ImageObject[];
        await Promise.all(images.map(img => this.cloudinary.deleteImage(img.public_id)));
        await this.prisma.filmes.delete({ where: { id } });
    }
    
}