
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class LoginInput {
    email: string;
    password: string;
}

export class RegisterInput {
    email: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    password: string;
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
    abstract login(loginInput: LoginInput): AuthResponse | Promise<AuthResponse>;

    abstract logout(): boolean | Promise<boolean>;

    abstract refreshTokens(): AuthResponse | Promise<AuthResponse>;

    abstract register(registerInput: RegisterInput): AuthResponse | Promise<AuthResponse>;
}

export abstract class IQuery {
    abstract customerDetails(customerId: number): Nullable<CustomerDetails> | Promise<Nullable<CustomerDetails>>;

    abstract dashboard(): DashboardData | Promise<DashboardData>;

    abstract me(): User | Promise<User>;
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
