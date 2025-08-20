import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilmesService } from './filmes.service';
import { CreateFilmesDTO } from './dto/create-filmes.dto';
import { CloudinaryService } from './cloudinary.service';
import { File as MulterFile } from 'multer'
import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateFilmesDTO } from './dto/update-filmes';
@Controller('filmes')
export class FilmesController {
    constructor( private service:FilmesService, private cloudinary: CloudinaryService ){}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({summary: "Casdastrar um novo livro"})
    @ApiBody({
        description: "Formulario com os dados dos Filmes.",
        schema: {
            type: "object",
            required: ["name", "director", "synopsis", "gender", "releaser", "images"],
            properties: {
                name: {type: "string", example: "harry potter prisioneiro de azkaban"},
                director: {type: "string", example: "Alfonso Cuarón"},
                synopsis: {
                    type: "string", 
                    example: `É o início do terceiro ano na escola de bruxaria Hogwarts. 
                    Harry, Ron e Hermione têm muito o que aprender. Mas uma ameaça ronda 
                    a escola e ela se chama Sirius Black. Após doze anos encarcerado na 
                    prisão de Azkaban, ele consegue escapar e volta para vingar seu mestre, 
                    Lord Voldemort. Para piorar, os Dementores, guardas supostamente enviados
                    para proteger Hogwarts e seguir os passos de Black, parecem ser ameaças 
                    ainda mais perigosas.`},
                gender: {type: "string", enum: ["ACAO",
                    "AVENTURA",
                    "COMEDIA",
                    "DRAMA",
                    "FICCAO",
                    "TERROR",
                    "ROMANCE",
                    "FANTASIA",
                    "MUSICAL",
                    "DOCUMENTARIO",]},
                releaser: {type: "string", example: "04-06-2004"},
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Máximo de 3 imagens',
                },
                
            }

        }
    })
    @ApiResponse({status: 201, description: "Filme criado com sucesso."})
    @ApiResponse({status: 400, description: "Dados inválidos fornecidos."})
    @ApiResponse({status: 500, description: "Erro interno do servidor."})
    async create(@Body() data: CreateFilmesDTO, @UploadedFiles() files: {images?: MulterFile[]}){
        if (!files.images || files.images.length === 0) {
            throw new BadRequestException('Pelo menos uma imagem deve ser enviada.');
        }

        const imageUrls = await Promise.all(
            files.images.map((file) => this.cloudinary.uploadImage(file.buffer)))

        return this.service.create({
            ...data,
            images: imageUrls, // Aqui você injeta as URLs para salvar
        });
    }
    @Get()
    @ApiOperation({summary: "lista todos os filmes."})
    @ApiResponse({
        status: 200,
        description: 'Lista de filmes retornada com sucesso.',
      })
      @ApiResponse({
        status: 404,
        description: 'Nenhum filme encontrado.',
      })
      @ApiResponse({
        status: 500,
        description: 'Erro interno do servidor.',
      })
    async getAllFilmes(){
        return await this.service.getAllFilmes()
    }

    @Get(':id')
    @ApiOperation({summary: "Retorna um filme por ID."})
    @ApiResponse({
        status: 200,
        description: 'Filme retornado com sucesso.',
      })
      @ApiResponse({
        status: 404,
        description: 'Nenhum filme encontrado com esse ID.',
      })
      @ApiResponse({
        status: 500,
        description: 'Erro interno do servidor.',
      })

    async findById(@Param('id') id: string){
        return await this.service.findById(id)
    }

    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Atualizar local com ou sem novas imagens' })
    @ApiBody({
        description: "Formulário com dados opcionais do local a serem atualizados. Se enviar imagens, elas substituirão as anteriores.",
        schema: {
            type: "object",
            required: ["name", "director", "synopsis", "gender", "releaser", "images"],
            properties: {
                name: {type: "string", example: "harry potter prisioneiro de azkaban"},
                director: {type: "string", example: "Alfonso Cuarón"},
                synopsis: {
                    type: "string", 
                    example: `É o início do terceiro ano na escola de bruxaria Hogwarts. 
                    Harry, Ron e Hermione têm muito o que aprender. Mas uma ameaça ronda 
                    a escola e ela se chama Sirius Black. Após doze anos encarcerado na 
                    prisão de Azkaban, ele consegue escapar e volta para vingar seu mestre, 
                    Lord Voldemort. Para piorar, os Dementores, guardas supostamente enviados
                    para proteger Hogwarts e seguir os passos de Black, parecem ser ameaças 
                    ainda mais perigosas.`},
                gender: {type: "string", enum: ["ACAO",
                    "AVENTURA",
                    "COMEDIA",
                    "DRAMA",
                    "FICCAO",
                    "TERROR",
                    "ROMANCE",
                    "FANTASIA",
                    "MUSICAL",
                    "DOCUMENTARIO",]},
                releaser: {type: "string", example: "04-06-2004"},
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Máximo de 3 imagens',
                }}}})
    @ApiResponse({status: 200, description: "Filme atualizado com sucesso."})
    @ApiResponse({status: 400, description: "Dados inválidos fornecidos."})
    @ApiResponse({status: 404, description: "Filme não encontrado."})
    @ApiResponse({status: 500, description: "Erro interno do servidor."})
    @ApiResponse({status: 422, description: "Erro de validação nos dados fornecidos."})
    @ApiResponse({status: 415, description: "Tipo de mídia não suportado."})
    @ApiResponse({status: 413, description: "Tamanho do arquivo excede o limite permitido."})
    
    async update(@Param('id') id: string, @Body() data: UpdateFilmesDTO, @UploadedFiles() files: {images?: MulterFile[]}){
        const newImages = files.images?.map(file => file.buffer);
        return this.service.update(id, data, newImages);
    }
    

    @Delete(':id')
    @ApiOperation({summary: "Deleta um filme por ID."})
    @ApiResponse({
        status: 200,
        description: 'Filme deletado com sucesso.',
      })
      @ApiResponse({
        status: 404,
        description: 'Nenhum filme encontrado com esse ID.',
      })
      @ApiResponse({
        status: 500,
        description: 'Erro interno do servidor.',
      })
    async delete(@Param('id') id: string){
        return this.service.delete(id)
    }
}