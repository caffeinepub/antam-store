import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ShoppingCartItem {
    productId: string;
    quantity: bigint;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    image: ExternalBlob;
    priceInCents: bigint;
}
export interface StoreOrder {
    id: bigint;
    status: OrderStatus;
    createdAt: bigint;
    user: Principal;
    totalAmountInCents: bigint;
    items: Array<ShoppingCartItem>;
}
export interface UserProfile {
    name: string;
    email: string;
    address: string;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<string>;
    addToCart(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllOrders(): Promise<Array<StoreOrder>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<ShoppingCartItem>>;
    getMyOrders(): Promise<Array<StoreOrder>>;
    getProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(): Promise<bigint>;
    removeFromCart(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
}
