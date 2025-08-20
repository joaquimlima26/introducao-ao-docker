import { PartialType } from "@nestjs/swagger";
import { CreateFilmesDTO } from "./create-filmes.dto";

export class UpdateFilmesDTO extends PartialType(CreateFilmesDTO){}