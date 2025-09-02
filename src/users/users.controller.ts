import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../auth/admin.guard";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { TuristaGuard } from "../auth/turista.guard";
import { UserService } from "./users.service";
import { RegisterDto } from "../auth/dto/register.dto";

@ApiTags('users') 
@UseGuards(JwtAuthGuard) // Protege todas as rotas deste controller com JWT
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) { }

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiBody({ type: RegisterDto })
  @ApiBearerAuth() // Protege esta rota com autenticação JWT na documentação Swagger
  @UseGuards(AdminGuard) // Apenas usuários com papel de ADMIN podem criar novos usuários
  create(@Body() data: RegisterDto) {
    return this.usersService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
  @ApiBearerAuth()
  @UseGuards(TuristaGuard) // Permite acesso a usuários com papel de TURISTA
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
    findOne( @Param('id') id: string) {
        return this.usersService.findOne(id)
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar um usuário' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
    @Put(':id')
    update( @Param('id') id: string, @Body() data:any){
        return this.usersService.update(id, data)
    }

    @Delete(':id')
    remove( @Param('id') id: string){
        return this.usersService.remove(id)
    }
}