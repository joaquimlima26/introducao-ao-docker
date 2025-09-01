import { Test, TestingModule } from "@nestjs/testing";
import { CloudinaryService } from "./cloudinary.service";
import { FilmesController } from "./filmes.controller";
import { FilmesService } from "./filmes.service";
import { filmesGender } from "@prisma/client";


describe("FilmesController", () => {
    let controller: FilmesController;
    let filmesService: jest.Mocked<FilmesService>;
    let cloudinaryService: jest.Mocked<CloudinaryService>
    
    beforeEach(async () =>{
    const mockFilmesService: jest.Mocked<FilmesService> = {
        create: jest.fn(),
        getAllFilmes: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    } as any
    
    const mockCloudinaryService: jest.Mocked<CloudinaryService> = {
        deleteImage: jest.fn(),
        uploadImage: jest.fn()
    } as any
    
    const module: TestingModule = await Test.createTestingModule({
        controllers: [FilmesController],
        providers: [
            {provide: FilmesService, useValue: mockFilmesService},
            {provide: CloudinaryService, useValue: mockCloudinaryService}
        ]
    }).compile()
    
    controller = module.get<FilmesController>(FilmesController)
    filmesService = module.get(FilmesService)
    cloudinaryService = module.get(CloudinaryService)
    })
    
    it("deve criar um filme", async () => {
        const dto = {
            name: "harry potter",
            director: "Alfonso Cuarón",
            synopsis: "...",
            gender: filmesGender.FANTASIA,
            releaser: "04-06-2004"
        } as any
        
        const files = { images: [{buffer: Buffer.from("img")}]} as any

        cloudinaryService.uploadImage.mockResolvedValue({
            url: "https://img", 
            public_id: "id"
        })
        
        filmesService.create.mockResolvedValue({
            id: "1",
            ...dto,
            images: ["https://img"]
        } as any)
        const result = await controller.create(dto, files)
        expect(result).toEqual({
            id: "1",
            ...dto,
            images: ["https://img"]
        })
        expect(cloudinaryService.uploadImage).toHaveBeenCalledTimes(1)
        expect(filmesService.create).toHaveBeenCalledTimes(1)
    })
    it("deve listar todos os filmes", async () => {
        const list = [            
            {id: "1", name: "harry potter"} as any,
            {id: "2", name: "senhor dos aneis"} as any
        ]
        filmesService.getAllFilmes.mockResolvedValue(list)


        const result = await controller.getAllFilmes()
        expect(result).toEqual(list)
        expect(filmesService.getAllFilmes).toHaveBeenCalledTimes(1)
    })
    it("deve retornar um filme por id", async () => {
        const filme = {id: "1", name: "harry potter"} as any
        filmesService.findById.mockResolvedValue(filme)
        const result = await controller.findById(filme.id)
        expect(result).toEqual(filme)
        expect(filmesService.findById).toHaveBeenCalledTimes(1)
        expect(filmesService.findById).toHaveBeenCalledWith(filme.id)
    })

    it("deve atualizar um filme", async () => {

        const id = "1"
        const dto = {
            id: "1",
            name: "harry potter",
            director: "Alfonso Cuarón",
            synopsis: "...",
            gender: filmesGender.FANTASIA,
            releaser: "04-06-2004",
            images: [{buffer: Buffer.from("img")}]
        } as any

        const files = {images: [{buffer: Buffer.from("img")}, {buffer: Buffer.from("img")}]} as any
        const newImages = [Buffer.from("img"), Buffer.from("img")]

        filmesService.update.mockResolvedValue(dto)

        const result = await controller.update(id, dto, files)

        expect(result).toEqual(dto)
        expect(filmesService.update).toHaveBeenCalledWith(id, dto, newImages)

    })

    it("deve deletar um filme", async () => {
        const id = "1"
        const dto = {
            id: "1",
            name: "harry potter",
            director: "Alfonso Cuarón",
            synopsis: "...",
            gender: filmesGender.FANTASIA,
            releaser: "04-06-2004",
            images: [{buffer: Buffer.from("img")}]
        } as any

        filmesService.delete.mockResolvedValue(dto)

        const result = await controller.delete(id)
        expect(result).toEqual(dto)
        expect(filmesService.delete).toHaveBeenCalledWith(id)
    })
})