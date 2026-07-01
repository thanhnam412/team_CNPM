import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import { toUser } from '../common/mongo-mappers';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async findAll() { return (await this.model.find().sort({ createdAt: -1 })).map(toUser); }
  async findById(id: string) { const user = await this.model.findById(id); return user ? toUser(user) : null; }
  async findDocumentByEmail(email: string) { return this.model.findOne({ email: email.toLowerCase().trim() }); }
  async findByEmail(email: string) { const user = await this.findDocumentByEmail(email); return user ? toUser(user) : null; }
  async findOrCreate(payload: { googleId?: string; email: string; name: string; avatar?: string }) {
    const found = await this.findDocumentByEmail(payload.email);
    if (found) return toUser(found);
    return this.create({ email: payload.email, name: payload.name, role: 'client', password: 'google-oauth' } as CreateUserDto);
  }
  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password || 'demo1234', 10);
    const user = await this.model.create({
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      fullName: dto.name,
      role: dto.role,
      title: dto.title || (dto.role === 'expert' ? 'AI Expert' : dto.role === 'enterprise' ? 'Enterprise Program Owner' : dto.role === 'admin' ? 'Admin' : 'Client'),
      company: dto.company || '',
      avatarUrl: dto.name.slice(0, 2).toUpperCase(),
      isVerified: dto.role === 'expert' ? false : dto.role === 'admin',
      trustScore: dto.role === 'admin' ? 100 : 80,
      enterpriseId: dto.role === 'enterprise' ? `ent_${Date.now()}` : '',
    });
    return toUser(user);
  }
  async update(id: string, dto: UpdateUserDto) {
    const payload: Record<string, unknown> = { ...dto };
    if (dto.name) { payload.fullName = dto.name; delete payload.name; }
    if (typeof dto.verified === 'boolean') { payload.isVerified = dto.verified; delete payload.verified; }
    if (typeof dto.blocked === 'boolean') { payload.isBlocked = dto.blocked; delete payload.blocked; }
    const user = await this.model.findByIdAndUpdate(id, payload, { new: true });
    if (!user) throw new NotFoundException('User not found');
    return toUser(user);
  }
}
