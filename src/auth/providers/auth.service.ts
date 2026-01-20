import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['roles', 'permissions', 'roles.permissions'],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, roles: user.roles.map(role => role.name),};
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    user.hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.save(user);

    return { accessToken, refreshToken };
  }

  async logout(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('User not found');

    user.hashedRefreshToken = null;
    await this.userRepo.save(user);

    return { message: 'Logged out successfully' };
  }

  // async refreshTokens(userId: number, refreshToken: string) {
  //   const user = await this.userRepo.findOneBy({ id: userId });
  //   if (!user || !user.hashedRefreshToken)
  //     throw new UnauthorizedException('Invalid refresh token');

  //   const matches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
  //   if (!matches) throw new UnauthorizedException('Invalid refresh token');

  //   const payload = { sub: user.id, email: user.email };
  //   const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
  //   const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

  //   user.hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
  //   await this.userRepo.save(user);

  //   return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  // }
  async refreshTokens(userId: number, refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
      if (!payload?.sub) throw new UnauthorizedException('Invalid refresh token');
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepo.findOneBy({ id: payload.sub });
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!matches) throw new UnauthorizedException('Invalid refresh token');

    const newPayload = { sub: user.id, email: user.email };
    const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

    user.hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.userRepo.save(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}