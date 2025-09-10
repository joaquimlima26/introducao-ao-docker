import { PrismaService } from "../prisma/prisma.service"
import { AuthService } from "./auth.service"
import { TestingModule, Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"

describe("AuthService", () => {
  let prisma: PrismaService
  let service: AuthService

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn()
    },
  }

  const mockJwtService = {
    sign: jest.fn().mockReturnValue("token"),
    verify: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile()

    prisma = module.get<PrismaService>(PrismaService)
    service = module.get<AuthService>(AuthService)
  })

  it("Deve registrar um usuário", async () => {
    const dto = {
      name: "tu",
      email: "tu@exemple.com",
      password: "tueu1234",
    } as any

    mockPrisma.user.create.mockResolvedValue({
      id: "1",
      name: dto.name,
      email: dto.email,
      role: "USER",
    })

    const result = await service.register(dto)

    expect(result).toEqual({
      id: "1",
      name: dto.name,
      email: dto.email,
      role: "USER",
    })
  })

  it("Deve validar se usuario ta cadastrado ou não ", async () => {
    const password = "tueu1234"
    const hashedPassword = await bcrypt.hash(password, 10)

    const dto = {
      id: "1",
      email: "tu@exemple.com",
      password: hashedPassword,
      role: "USER"
    } as any

    mockPrisma.user.findUnique.mockResolvedValue(dto)

    const result = await service.validateUser(dto.email, password)

    expect(result).toEqual({
      id: "1",
      email: dto.email,
      password: dto.password,
      role: "USER"
    })

  })

  it("Deve fazer login de um usuário existente", async () => {
    const dto = {
      id: "1",
      email: "tu@exemple.com",
      password: "tueu1234"
    } as any
     
    const user = await service.validateUser(dto.email, dto.password)
    const token =  mockJwtService.sign(user)

    const result = await service.login(dto)

    expect(result).toEqual({access_token: token})
    expect(mockJwtService.sign).toHaveBeenCalledWith(user)
    expect(prisma.user.findUnique).toHaveBeenCalledWith({where: {email: dto.email}})
  })
})