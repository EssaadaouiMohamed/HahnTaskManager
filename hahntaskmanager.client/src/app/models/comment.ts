import { UserDto } from './user';

export interface CommentDto {
  id?: string;
  text: string;
  createdAt?: Date;
  author?: UserDto;
} 
