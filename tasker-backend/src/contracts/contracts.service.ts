import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract, ContractDocument } from './contract.schema';
import { toContract } from '../common/mongo-mappers';
@Injectable()
export class ContractsService {
  constructor(@InjectModel(Contract.name) private model: Model<ContractDocument>) {}
  async findAll() { return (await this.model.find().sort({ createdAt: -1 })).map(toContract); }
  async findOne(id: string) { const c = await this.model.findById(id); if (!c) throw new NotFoundException('Contract not found'); return toContract(c); }
  async update(id: string, dto: UpdateContractDto) { const c = await this.model.findByIdAndUpdate(id, dto, { new: true }); if (!c) throw new NotFoundException('Contract not found'); return toContract(c); }
}
