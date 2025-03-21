import { Resolver, Query, Mutation, Args, Field, ObjectType, InputType, ID } from '@nestjs/graphql';
import { ProductsService, Product as ProductType, FilterProductsParams } from './products.service';

@ObjectType()
class Product {
  @Field(() => ID)
  id: string;

  @Field()
  photo: string;

  @Field()
  name: string;

  @Field()
  suppliers: string;

  @Field()
  stock: string;

  @Field()
  price: string;

  @Field()
  category: string;
}

@ObjectType()
class ProductsResponse {
  @Field(() => [Product])
  products: Product[];

  @Field(() => [String])
  categories: string[];
}

@InputType()
class CreateProductInput {
  @Field()
  photo: string;

  @Field()
  name: string;

  @Field()
  suppliers: string;

  @Field()
  stock: string;

  @Field()
  price: string;

  @Field()
  category: string;
}

@InputType()
class UpdateProductInput {
  @Field({ nullable: true })
  photo?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  suppliers?: string;

  @Field({ nullable: true })
  stock?: string;

  @Field({ nullable: true })
  price?: string;

  @Field({ nullable: true })
  category?: string;
}

@InputType()
class ProductFilterInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  suppliers?: string;

  @Field({ nullable: true })
  minPrice?: string;

  @Field({ nullable: true })
  maxPrice?: string;
}

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => ProductsResponse)
  async getProducts(
    @Args('filters', { nullable: true }) filters?: ProductFilterInput,
  ): Promise<{ products: ProductType[]; categories: string[] }> {
    const filterParams: FilterProductsParams = filters || {};

    const [products, categories] = await Promise.all([
      this.productsService.getAllProducts(filterParams),
      this.productsService.getCategories(),
    ]);

    return { products, categories };
  }

  @Query(() => Product, { nullable: true })
  async getProduct(@Args('id') id: string): Promise<ProductType | null> {
    return this.productsService.getProductById(id);
  }

  @Mutation(() => Product)
  async createProduct(@Args('input') input: CreateProductInput): Promise<ProductType> {
    return this.productsService.createProduct(input);
  }

  @Mutation(() => Product, { nullable: true })
  async updateProduct(
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductType | null> {
    return this.productsService.updateProduct(id, input);
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Args('id') id: string): Promise<boolean> {
    return this.productsService.deleteProduct(id);
  }
}
