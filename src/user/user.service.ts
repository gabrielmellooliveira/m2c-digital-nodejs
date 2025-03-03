import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createId } from '@paralleldrive/cuid2';
import { ListUsersDto } from './dtos/list-users.dto';
import { UserDto } from './dtos/user.dto';
import { FullUserDto } from './dtos/full-user.dto';
import { EncryptionHelper } from 'src/common/helpers/encryption.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<ListUsersDto> {
    try {
      const users = await this.userRepository.find({ where: { deleted: false } });

      return {
        users
      } as ListUsersDto;
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async getUserById(id: string): Promise<UserDto> {
    try {
      const user = await this.userRepository.findOneBy({ id, deleted: false });

      if (!user) {
        throw new HttpException("User not found", 404);
      }

      return user as UserDto;
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async getFullUserByEmail(email: string): Promise<FullUserDto> {
    try {
      const user = await this.userRepository.findOneBy({ email, deleted: false });

      if (!user) {
        throw new HttpException("User not found", 404);
      }

      return user as FullUserDto;
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<ResponseDto> {
    try {
      const user = await this.userRepository.save({
        id: createId(),
        email: createUserDto.email,
        password: EncryptionHelper.encrypt(createUserDto.password),
      })

      return new ResponseDto(user.id, 'User added with success');
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto> {
    try {
      await this.userRepository.update(userId, {
        ...updateUserDto
      })

      return new ResponseDto(userId, 'User edited with success');
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  async deleteUser(userId: string): Promise<ResponseDto> {
    try {
      // A atualização do campo "deleted" é feita para respeitar a regra de negócio
      // e manter o campo atualizado, mesmo utilizando o soft delete do próprio ORM
      await this.userRepository.update(userId, {
        deleted: true
      })

      await this.userRepository.softDelete(userId);
      
      return new ResponseDto(userId, 'User deleted with success');
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }
}