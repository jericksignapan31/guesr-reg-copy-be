import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: 'Base64 encoded signature image' })
  @IsString()
  @IsNotEmpty()
  signature: string;
}
