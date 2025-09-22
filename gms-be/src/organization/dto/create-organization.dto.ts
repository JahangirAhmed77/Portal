import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MinLength,
} from 'class-validator';
import { CreateOfficeDto } from './create-office-dto';

export class CreateOrganizationDto {
  @IsString()
  @IsOptional()
  organizationId?: string; // service uses dto.organizationId

  @IsString()
  @IsNotEmpty()
  name: string; // service expects "name"

  @IsString()
  @IsOptional()
  organizationLogo?: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string; // service expects "phoneNumber"

  @IsString()
  @IsOptional()
  phoneNumber2?: string;

  @IsString()
  @IsNotEmpty()
  address: string; // service expects "address"

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  office?: CreateOfficeDto[];
}
