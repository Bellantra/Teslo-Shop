import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

  @ApiProperty({
    example:'0de034b1-4f3e-4f7f-8d9f-e991a96ebeee',
    description: 'Product uuid',
    uniqueItems:true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example:'T-Shirt Teslo',
    description: 'Product title',
    uniqueItems:true
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example:0,
    description: 'Product price'    
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example:'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: 'Product description',
    uniqueItems:true
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example:'T_Shirt_Teslo',
    description: 'Product slug - for SEO',
    uniqueItems:true
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example:10,
    description: 'Product stock',
    default:0
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example:['M','XL','XXL'],
    description: 'Product size',   
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example:'women',
    description: 'Product gender',
  
  })
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  //images
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(
    ()=>User,
    (user)=> user.product,
    {eager:true}
  )
  user:User

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
