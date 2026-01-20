import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(96)
    name:string;

    @IsString()
    @IsNotEmpty()
    description: string;
}