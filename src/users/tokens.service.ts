import { Injectable } from '@nestjs/common';

@Injectable()
export class TokensService {

  async createToken(){
    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.sign(payload, { expiresIn: '120s' }),
    };
  }
}
