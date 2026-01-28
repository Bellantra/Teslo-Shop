import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsServide: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();

    return 'Seed Executed!!';
  }

  private async insertNewProducts() {
    await this.productsServide.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsServide.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
