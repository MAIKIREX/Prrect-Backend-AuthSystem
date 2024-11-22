import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'
import { PartialType } from '@nestjs/swagger'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    @IsString()
    @IsNotEmpty()
    readonly lastname: string;
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
    @IsString()
    @IsNotEmpty()
    @Length(6)
    readonly password: string;
    @IsString()
    @IsNotEmpty()
    @Length(6)
    readonly confirmPassword: string;
    @IsNotEmpty()
    readonly role: string;
}
