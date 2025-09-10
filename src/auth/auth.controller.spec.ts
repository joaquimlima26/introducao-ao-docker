import { JwtService } from "@nestjs/jwt"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { TestingModule, Test } from "@nestjs/testing"

describe("AuthController", () => {
    let controller: AuthController
    let authService: jest.Mocked<AuthService>
    // let JwtService: jest.mocked<JwtService>

    beforeEach(async () => {
        const mockAuthController: jest.Mocked<AuthService> = {
            register: jest.fn(),
            login: jest.fn(),
        } as any

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthController },
                { provide: JwtService, useValue: { sign: jest.fn() } }
            ],
        }).compile()

        controller = module.get<AuthController>(AuthController)
        authService = module.get(AuthService)
    })
    it("Deve registar um usuário", async () => {
        const dto = { name: "tu", email: "tujaExiste@.exemple", password: "tueu1234" } as any

        authService.register.mockResolvedValue({
            id: "1",
            name: dto.name,
            email: dto.email,
            role: "USER"
        })

        const result = await controller.register(dto)
        expect(result).toEqual({
            id: "1",
            name: dto.name,
            email: dto.email,
            role: "USER"
        })
        expect(authService.register).toHaveBeenCalledWith(dto)
    })

    it("Deve fazer login do usuário ja registrado", async () => {
        const dto = { email: "tujaExiste@.exemple", password: "tueu1234" }

        authService.login.mockResolvedValue({ access_token: "token" })

        const result = await controller.login(dto)
        
        expect(authService.login).toHaveBeenCalledWith(dto)
        expect(result).toEqual( {access_token: "token"} )
    })


})