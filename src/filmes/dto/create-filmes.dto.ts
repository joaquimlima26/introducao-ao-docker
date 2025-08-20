import { ApiProperty } from "@nestjs/swagger"
import { filmesGender } from "@prisma/client"
import { IsEnum, IsInt, isNotEmpty, IsNotEmpty, IsString, Matches } from "class-validator"

export class CreateFilmesDTO {
    @ApiProperty({example: "harry potter prisioneiro de azkaban"})
    @IsNotEmpty()
    @IsString()
    name: string
    @ApiProperty({example: "Alfonso Cuarón"})
    @IsNotEmpty()
    @IsString()
    director: string
    @ApiProperty({example: "É o início do terceiro ano na escola de bruxaria Hogwarts. Harry, Ron e Hermione têm muito o que aprender. Mas uma ameaça ronda a escola e ela se chama Sirius Black. Após doze anos encarcerado na prisão de Azkaban, ele consegue escapar e volta para vingar seu mestre, Lord Voldemort. Para piorar, os Dementores, guardas supostamente enviados para proteger Hogwarts e seguir os passos de Black, parecem ser ameaças ainda mais perigosas."})
    @IsString()
    @IsNotEmpty()
    synopsis: string
    @ApiProperty({example: "FANTASIA"})
    @IsEnum(filmesGender)
    @IsString()
    gender: filmesGender
    @ApiProperty({example: "04-06-2004"})
    @IsString()
    @IsNotEmpty({ message: 'A data não pode estar vazia.' })
    @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'A data deve estar no formato dd-mm-yyyy.',
    })
    releaser: string
}