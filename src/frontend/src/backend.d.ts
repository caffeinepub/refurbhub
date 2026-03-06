import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Product {
    id: bigint;
    ram: string;
    storage: string;
    name: string;
    createdAt: bigint;
    description: string;
    stock: bigint;
    imageUrl: string;
    discountPrice: number;
    brand: string;
    price: number;
    processor: string;
    condition: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface OrderItem {
    productId: bigint;
    quantity: bigint;
    price: number;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    total: number;
    createdAt: bigint;
    email: string;
    address: string;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, brand: string, processor: string, ram: string, storage: string, condition: string, price: number, discountPrice: number, description: string, stock: bigint, imageUrl: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(customerName: string, email: string, address: string, items: Array<OrderItem>, total: number): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(id: bigint): Promise<Order | null>;
    getOrders(): Promise<Array<Order>>;
    getProduct(id: bigint): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateOrderStatus(id: bigint, status: string): Promise<void>;
    updateProduct(id: bigint, name: string, brand: string, processor: string, ram: string, storage: string, condition: string, price: number, discountPrice: number, description: string, stock: bigint, imageUrl: string): Promise<void>;
}
