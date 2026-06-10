# SOLID Order Management - NestJS Architecture

Cấu trúc thư mục:
```text
solid-order-management-nestjs/

src/
│
├── main.ts
├── app.module.ts
│
├── domain/
│   ├── product.ts
│   ├── order-item.ts
│   └── order.ts
│
├── application/
│   │
│   ├── contracts/
│   │   ├── payment.contract.ts
│   │   ├── discount.contract.ts
│   │   ├── shipping.contract.ts
│   │   ├── invoice.contract.ts
│   │   └── order-repository.contract.ts
│   │
│   ├── usecases/
│   │   └── create-order.usecase.ts
│   │
│   └── mappers/
│       └── order.mapper.ts
│
├── infrastructure/
│   │
│   ├── payment/
│   │   ├── cash-payment.service.ts
│   │   └── bank-payment.service.ts
│   │
│   ├── discount/
│   │   ├── percentage-discount.service.ts
│   │   └── fixed-discount.service.ts
│   │
│   ├── shipping/
│   │   ├── standard-shipping.service.ts
│   │   └── express-shipping.service.ts
│   │
│   ├── invoice/
│   │   └── console-invoice.service.ts
│   │
│   └── repository/
│       └── memory-order.repository.ts
│
└── order/
    │
    ├── order.controller.ts
    │
    └── dto/
        └── create-order.dto.ts
```

## 1. Domain Model

### product.ts

```typescript
export class Product {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly price: number
    ) {}

}
SRP:

Product chỉ chứa dữ liệu sản phẩm

Không tính tiền

Không lưu DB

### order-item.ts
```typescript
import { Product } from "./product";

export class OrderItem {

    constructor(
        public readonly product: Product,
        public readonly quantity: number
    ) {}

    subtotal(): number {
        return this.product.price * this.quantity;
    }

}
```
### order.ts
```typescript
import { OrderItem } from "./order-item";

export class Order {

    private items: OrderItem[] = [];

    constructor(
        public readonly id: string
    ){}

    addItem(item: OrderItem){
        this.items.push(item);
    }

    getItems(){
        return this.items;
    }

}
```
## 2. Interface (Dependency Inversion)
### discount.interface.ts
```typescript
import { Order } from "../../domain/order";

export interface DiscountStrategy {
    apply(order: Order): number;
}
```
### shipping.interface.ts
```typescript
import { Order } from "../../domain/order";

export interface ShippingStrategy {
    calculate(order: Order): number;
}
```
### payment.interface.ts
```typescript
export interface PaymentService {
    pay(amount: number): Promise<boolean>;
}
```
### invoice.interface.ts
```typescript
import { Order } from "../../domain/order";

export interface InvoicePrinter {
    print(order: Order, total: number): void;
}
```
### repository.interface.ts
```typescript
import { Order } from "../../domain/order";

export interface OrderRepository {
    save(order: Order): Promise<void>;
}
```
## 3. Implement Service
### Discount
#### percentage-discount.service.ts
```typescript
import { Injectable } from "@nestjs/common";
import { DiscountStrategy } from "../../application/interfaces/discount.interface";
import { Order } from "../../domain/order";

@Injectable()
export class PercentageDiscountService
implements DiscountStrategy {

    apply(order: Order): number {
        const total =
            order.getItems()
            .reduce(
                (sum, item) => sum + item.subtotal(),
                0
            );
        return total * 0.1;
    }

}
```
#### fixed-discount.service.ts
```typescript
@Injectable()
export class FixedDiscountService
implements DiscountStrategy {

    apply(order: Order) {
        return 50000;
    }

}
```
### Shipping
#### standard-shipping.service.ts
```typescript
@Injectable()
export class StandardShippingService
implements ShippingStrategy {

    calculate(order: Order) {
        return 30000;
    }

}
```
#### express-shipping.service.ts
```typescript
@Injectable()
export class ExpressShippingService
implements ShippingStrategy {

    calculate(order: Order) {
        return 70000;
    }

}
```
### Payment
#### cash-payment.service.ts
```typescript
@Injectable()
export class CashPaymentService
implements PaymentService {

    async pay(amount: number) {
        console.log(`Cash payment ${amount}`);
        return true;
    }

}
```
#### bank-payment.service.ts
```typescript
@Injectable()
export class BankPaymentService
implements PaymentService {

    async pay(amount: number) {
        console.log(`Bank transfer ${amount}`);
        return true;
    }

}
```
### Invoice
#### console-invoice.service.ts
```typescript
@Injectable()
export class ConsoleInvoiceService
implements InvoicePrinter {

    print(order: Order, total: number) {
        console.log(`
ORDER:
${order.id}

TOTAL:
${total}
`);
    }

}
```
### Repository
#### memory-order.repository.ts
```typescript
@Injectable()
export class MemoryOrderRepository
implements OrderRepository {

    private orders: Order[] = [];

    async save(order: Order) {
        this.orders.push(order);
    }

}
```
## 4. UseCase (Business Flow)
### create-order.usecase.ts
```typescript
@Injectable()
export class CreateOrderUseCase {

    constructor(
        private discount: DiscountStrategy,
        private shipping: ShippingStrategy,
        private payment: PaymentService,
        private invoice: InvoicePrinter,
        private repository: OrderRepository
    ) {}

    async execute(order: Order) {

        let total =
            order.getItems()
            .reduce(
                (sum, item) => sum + item.subtotal(),
                0
            );

        total -= this.discount.apply(order);
        total += this.shipping.calculate(order);

        await this.payment.pay(total);
        await this.repository.save(order);

        this.invoice.print(order, total);
    }

}
```
## 5. Controller
### order.controller.ts
```typescript
@Controller("orders")
export class OrderController {

    constructor(
        private createOrder: CreateOrderUseCase
    ) {}

    @Post()
    create() {

        const order =
            new Order("ORD-001");

        const product =
            new Product("P01", "Keyboard", 500000);

        order.addItem(
            new OrderItem(product, 2)
        );

        return this.createOrder.execute(order);
    }

}
```
## 6. app.module.ts
Dependency Injection:

```typescript
@Module({
    controllers: [OrderController],
    providers: [
        CreateOrderUseCase,

        {
            provide: "DiscountStrategy",
            useClass: PercentageDiscountService
        },

        {
            provide: "ShippingStrategy",
            useClass: StandardShippingService
        },

        {
            provide: "PaymentService",
            useClass: CashPaymentService
        },

        {
            provide: "InvoicePrinter",
            useClass: ConsoleInvoiceService
        },

        {
            provide: "OrderRepository",
            useClass: MemoryOrderRepository
        }
    ]
})
export class AppModule {}
```
## Phân tích SOLID trong NestJS
### S — Single Responsibility
Sai:

```typescript
class OrderService {
    calculate()
    pay()
    print()
    save()
}
```
Một class làm 4 việc.

Sau refactor:

```text
Order
 ├── Calculator
 ├── Payment
 ├── Invoice
 └── Repository
```
### O — Open Closed
Thêm giảm giá mới:

```typescript
class VipDiscount implements DiscountStrategy
```
Không sửa CreateOrderUseCase.

### L — Liskov
Các implementation thay thế được:

```text
PaymentService
        |
CashPayment
BankPayment
```
Không ảnh hưởng logic.

### I — Interface Segregation
Không tạo:

```typescript
interface OrderService {
    pay()
    save()
    print()
}
```
Tách:

- `PaymentService`
- `Repository`
- `InvoicePrinter`

### D — Dependency Inversion
Sai: `new CashPaymentService()`
Đúng: `PaymentService` (NestJS Inject dependency)

## Kết luận
Kiến trúc mới:

```text
Controller
      |
UseCase
      |
Interface
      |
Implementation
      |
Infrastructure
```
Cho phép:

đổi NestJS sang Express/Fastify mà không đổi domain
đổi database MySQL → MongoDB → PostgreSQL
thêm payment mới
thêm discount mới
thêm transport mới
```
