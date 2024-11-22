import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto} from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private ProductRepo: Repository<Product>,
  ) {}

  async findAll() {
    return await this.ProductRepo.find();
  }

  async findOne(id: number) {
    const object = await this.ProductRepo.findOne({ where: {id} });
    if (!object) throw new NotFoundException(`object not found.`);
    return object;
  }

  async create(data: CreateProductDto) {
    const newObject = this.ProductRepo.create(data);
    return await this.ProductRepo.save(newObject);
  }

  async update(id: number, changes: UpdateProductDto) {
    const object = await this.findOne(id);
    this.ProductRepo.merge(object, changes);
    return await this.ProductRepo.save(object);
  }

  async remove(id: number) {
    return await this.ProductRepo.delete(id);
  }
}
