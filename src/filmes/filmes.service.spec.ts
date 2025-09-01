import { Test, TestingModule } from "@nestjs/testing"
import { FilmesService } from "./filmes.service"
import { PrismaService } from "../prisma/prisma.service"
import { CloudinaryService } from "./cloudinary.service"
import { filmesGender } from "@prisma/client"
import { BadRequestException } from "@nestjs/common"


const mockPrisma = {
    filmes: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
}
const mockCloudinaryService: jest.Mocked<CloudinaryService> = {
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
  } as any;

describe("FilmesService", () => {
    let service:FilmesService
    let prisma: PrismaService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FilmesService,
                {provide: CloudinaryService, useValue: mockCloudinaryService},
                {provide: PrismaService, useValue: mockPrisma}
            ]
        }).compile()

        service = module.get<FilmesService>(FilmesService);
        prisma = module.get<PrismaService>(PrismaService)

    })

    it("deve criar um filme", async () => {
        const dto = {
            name: "harry potter",
            director: "Alfonso Cuarón",
            synopsis: "...",
            gender: filmesGender.FANTASIA,
            releaser: "04-06-2004",
            images: [{ url: "https://img", public_id: "id" }]
        } as any

      mockPrisma.filmes.create.mockResolvedValue(dto)

        const result = await service.create(dto)
        expect(result).toEqual(dto)
        expect(prisma.filmes.create).toHaveBeenCalledWith({data: dto})
    })

    it("deve retornar uma lista de filmes", async () => {
        const filmesMock = [{
            name: "Harry Potter",
            director: "Alfonso Cuarón",
            synopsis: "...",
            gender: filmesGender.FANTASIA,
            releaser: "16-08-2013",
            images: [{ url: "https://img", public_id: "id" }]
        },
        {
            name: "Percy Jackson",
            director: "Thor Freudenthal",
            synopsis: "...",
            gender: filmesGender.FANTASIA,
            releaser: "04-06-2004",
            images: [{ url: "https://img", public_id: "id" }]
        }
        ]

        mockPrisma.filmes.findMany.mockResolvedValue(filmesMock)

        const result = await service.getAllFilmes()
        expect(result).toEqual(filmesMock)
        expect(mockPrisma.filmes.findMany).toHaveBeenCalledWith()

    })

    it("deve lançar um erro se a lista de filmes estiver vazia", async () => {
        mockPrisma.filmes.findMany.mockResolvedValue([])
        await expect(service.getAllFilmes()).rejects.toThrow(BadRequestException)
        expect(mockPrisma.filmes.findMany).toHaveBeenCalledWith()
    }
    )

    it("deve retornar um filme por id", async () => {
        const id = "1"
        const filmeMock = {
            id: "1",
            name: "Harry Potter",
            director: "Alfonso Cuarón",
            synopsis: "...",
            gender: filmesGender.FANTASIA,
            releaser: "16-08-2013",
            images: [{ url: "https://img", public_id: "id" }]
        }

        mockPrisma.filmes.findUnique.mockResolvedValue(filmeMock)

        const result = await service.findById(id)
        expect(result).toEqual(filmeMock)
        expect(mockPrisma.filmes.findUnique).toHaveBeenCalledWith({where: {id}})

    })

    it("deve lançar um erro se o filme não for encontrado por id", async () => {
        mockPrisma.filmes.findUnique.mockResolvedValue(null)
        await expect(service.findById("1")).rejects.toThrow(BadRequestException)
        expect(mockPrisma.filmes.findUnique).toHaveBeenCalledWith({where:{id: "1"}})
    })

    it("deve atualizar um filme por id", async () => {
        const id = "1"
        const filmeMock = {
            id: "1",
            name: "Harry Potter",
            director: "Alfonso Cuarón",
            synopsis: "...",
            gender: filmesGender.FANTASIA,
            releaser: "16-08-2013",
            images: [{ url: "https://img", public_id: "id" }]
        }

        mockPrisma.filmes.findUnique.mockResolvedValue(id)
        mockPrisma.filmes.update.mockResolvedValue(filmeMock)

        const result = await service.update(id, filmeMock)
        expect(result).toEqual(filmeMock)
        expect(mockPrisma.filmes.update).toHaveBeenCalledWith({
            where: {id},
            data: filmeMock
        })

    })

    it("deve lançar um erro se o filme não for encontrado para atualizar", async () => {
        mockPrisma.filmes.findUnique.mockResolvedValue(null)
        await expect(service.update("1", {})).rejects.toThrow(BadRequestException)
        expect(mockPrisma.filmes.findUnique).toHaveBeenCalledWith({where:{id: "1"}})
    })

    it("deve deletar um filme por id", async () => {
        const id = "1"
        const filmeMock = {
            id: "1",
            name: "Harry Potter",
            director: "Alfonso Cuarón",
            synopsis: "...",
            gender: filmesGender.FANTASIA,
            releaser: "16-08-2013",
            images: [{ url: "https://img", public_id: "id" }]
        }

        mockPrisma.filmes.findUnique.mockResolvedValue(filmeMock)
        mockPrisma.filmes.delete.mockResolvedValue(filmeMock)
        mockCloudinaryService.deleteImage.mockResolvedValue(undefined);

        const result = await service.delete(id)
        expect(result).toBeUndefined();
        expect(mockPrisma.filmes.delete).toHaveBeenCalledWith({ where: { id } });
        expect(mockCloudinaryService.deleteImage).toHaveBeenCalledWith("id");
    })

    it("deve lançar um erro se o filme não for encontrado para deletar", async () => {
        mockPrisma.filmes.findUnique.mockResolvedValue(null)
        await expect(service.delete("1")).rejects.toThrow(BadRequestException)
        expect(mockPrisma.filmes.findUnique).toHaveBeenCalledWith({where:{id: "1"}})
    })
} )