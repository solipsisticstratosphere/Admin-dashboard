
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateProductInput {
    category: string;
    name: string;
    photo: string;
    price: string;
    stock: string;
    suppliers: string;
}

export class CreateSupplierInput {
    address: string;
    amount: string;
    company: string;
    date?: Nullable<string>;
    name: string;
    status: string;
}

export class CustomerFiltersInput {
    address?: Nullable<string>;
    email?: Nullable<string>;
    name?: Nullable<string>;
    phone?: Nullable<string>;
    register_date?: Nullable<string>;
    spent?: Nullable<string>;
}

export class LoginInput {
    email: string;
    password: string;
}

export class ProductFilterInput {
    category?: Nullable<string>;
    maxPrice?: Nullable<string>;
    minPrice?: Nullable<string>;
    name?: Nullable<string>;
    suppliers?: Nullable<string>;
}

export class RegisterInput {
    email: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    password: string;
}

export class SupplierFilterInput {
    company?: Nullable<string>;
    name?: Nullable<string>;
    status?: Nullable<string>;
}

export class UpdateProductInput {
    category?: Nullable<string>;
    name?: Nullable<string>;
    photo?: Nullable<string>;
    price?: Nullable<string>;
    stock?: Nullable<string>;
    suppliers?: Nullable<string>;
}

export class UpdateSupplierInput {
    address?: Nullable<string>;
    amount?: Nullable<string>;
    company?: Nullable<string>;
    date?: Nullable<string>;
    name?: Nullable<string>;
    status?: Nullable<string>;
}

export class AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export class Customer {
    address: string;
    country: string;
    email: string;
    id: number;
    name: string;
    phone: string;
    photo?: Nullable<string>;
    registerDate: DateTime;
    spent: string;
}

export class CustomerDetails {
    address: string;
    country: string;
    email: string;
    id: number;
    name: string;
    phone: string;
    photo?: Nullable<string>;
    registerDate: DateTime;
    spent: string;
    transactions: Transaction[];
}

export class CustomerEntry {
    address: string;
    email: string;
    id: string;
    name: string;
    phone: string;
    photo?: Nullable<string>;
    register_date: string;
    spent: string;
}

export class DashboardData {
    recentCustomers: Customer[];
    stats: DashboardStats;
    transactions: Transaction[];
}

export class DashboardStats {
    totalCustomers: number;
    totalProducts: number;
    totalSuppliers: number;
}

export abstract class IMutation {
    abstract createProduct(input: CreateProductInput): Product | Promise<Product>;

    abstract createSupplier(input: CreateSupplierInput): Supplier | Promise<Supplier>;

    abstract deleteProduct(id: string): boolean | Promise<boolean>;

    abstract deleteSupplier(id: string): boolean | Promise<boolean>;

    abstract login(loginInput: LoginInput): AuthResponse | Promise<AuthResponse>;

    abstract logout(): boolean | Promise<boolean>;

    abstract refreshTokens(): AuthResponse | Promise<AuthResponse>;

    abstract register(registerInput: RegisterInput): AuthResponse | Promise<AuthResponse>;

    abstract updateProduct(id: string, input: UpdateProductInput): Nullable<Product> | Promise<Nullable<Product>>;

    abstract updateSupplier(id: string, input: UpdateSupplierInput): Nullable<Supplier> | Promise<Nullable<Supplier>>;
}

export class Order {
    address: string;
    id: number;
    name: string;
    order_date: string;
    photo?: Nullable<string>;
    price: string;
    products: string;
    status: string;
}

export class OrdersResponse {
    items: Order[];
    totalCount: number;
}

export class Product {
    category: string;
    id: string;
    name: string;
    photo: string;
    price: string;
    stock: string;
    suppliers: string;
}

export class ProductsResponse {
    categories: string[];
    products: Product[];
}

export abstract class IQuery {
    abstract customerDetails(customerId: number): Nullable<CustomerDetails> | Promise<Nullable<CustomerDetails>>;

    abstract dashboard(): DashboardData | Promise<DashboardData>;

    abstract getCustomer(id: string): Nullable<CustomerEntry> | Promise<Nullable<CustomerEntry>>;

    abstract getCustomers(filters?: Nullable<CustomerFiltersInput>): CustomerEntry[] | Promise<CustomerEntry[]>;

    abstract getProduct(id: string): Nullable<Product> | Promise<Nullable<Product>>;

    abstract getProducts(filters?: Nullable<ProductFilterInput>): ProductsResponse | Promise<ProductsResponse>;

    abstract getSupplier(id: string): Nullable<Supplier> | Promise<Nullable<Supplier>>;

    abstract getSuppliers(filters?: Nullable<SupplierFilterInput>): Supplier[] | Promise<Supplier[]>;

    abstract me(): User | Promise<User>;

    abstract orders(): OrdersResponse | Promise<OrdersResponse>;
}

export class Supplier {
    address: string;
    amount: string;
    company: string;
    date: string;
    id: string;
    name: string;
    status: string;
}

export class Transaction {
    amount: string;
    createdAt?: Nullable<DateTime>;
    customerId?: Nullable<number>;
    email?: Nullable<string>;
    id: number;
    name: string;
    type: string;
}

export class User {
    createdAt: DateTime;
    email: string;
    firstName?: Nullable<string>;
    id: string;
    lastName?: Nullable<string>;
    updatedAt: DateTime;
}

export type DateTime = any;
type Nullable<T> = T | null;
