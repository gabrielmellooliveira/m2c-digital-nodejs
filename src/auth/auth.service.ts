import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from '@nestjs/jwt';
import { EncryptionHelper } from "src/common/helpers/encryption.helper";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, 
    private jwtService: JwtService
  ) {}
  
  async signIn(email: string, password: string) {
    try {
      const user = await this.userService.getFullUserByEmail(email);

      const encryptedPassword = EncryptionHelper.encrypt(password);

      if (user.password !== encryptedPassword) {
        throw new UnauthorizedException("Invalid password");
      }

      const access_token = await this.jwtService.signAsync({ 
        sub: user.id,
        email: user.email 
      });

      return {
        access_token
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }
}