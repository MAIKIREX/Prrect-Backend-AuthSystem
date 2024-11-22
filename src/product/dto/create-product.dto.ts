import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string
  @IsNumber()
  readonly price: number
}
