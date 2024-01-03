import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PagintionDto } from 'src/databases/dto/pagination.dto';
import { CheckDto } from 'src/commons/validation.pipe';
import { JwtService } from '@nestjs/jwt';
import { Public } from './commons/public.decorator';
import * as bcrypt from 'bcrypt';
import { CheckRoles } from './commons/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  @CheckRoles('admin')
  @CheckDto('create')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @CheckDto()
  @Get()
  findAll(@Query() pagintionDto: PagintionDto) {
    this.logger.warn('This action returns all cats');
    return this.usersService.findAll(pagintionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @CheckRoles('admin')
  @CheckDto('update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Public()
  @CheckDto('create')
  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    createUserDto.roleIds = [];
    return this.usersService.create(createUserDto);
  }

  @Public()
  @CheckDto('create')
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const user = await this.usersService.findOneByName(username);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('用户名或密码输入错误');
    }
    const payload = { sub: user.id, username: user.username };

    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.sign(payload, { expiresIn: '3d' }),
    };
  }

  @Public()
  @CheckDto()
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(data.sub);

      const payload = { sub: user.id, username: user.username };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
