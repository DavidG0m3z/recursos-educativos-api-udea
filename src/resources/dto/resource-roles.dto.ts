import { IsIn } from "class-validator";

const ROLE_VALUES = [ 'Si', 'No', 'Depende' ] as const;

export class ResourceRolesDto {
    @IsIn(ROLE_VALUES)
    Fuentes: string;

    @IsIn(ROLE_VALUES)
    Guion: string;

    @IsIn(ROLE_VALUES)
    Estilo: string;

    @IsIn(ROLE_VALUES)
    Ilustracion: string;

    @IsIn(ROLE_VALUES)
    Diseño: string;

    @IsIn(ROLE_VALUES)
    Aud: string;

    @IsIn(ROLE_VALUES)
       Locucion: string;

    @IsIn(ROLE_VALUES)
    Anim: string;

    @IsIn(ROLE_VALUES)
    DesarrolloFrontend: string;

    @IsIn(ROLE_VALUES)
    Publicador: string;
}
