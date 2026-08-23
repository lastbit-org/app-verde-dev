import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderItemEntity } from '../orders/order-item.entity';
import { OrderEntity } from '../orders/order.entity';
import { ProductEntity } from '../products/product.entity';
import { AddressEntity } from '../addresses/address.entity';
import { UserEntity } from '../users/user.entity';
import { DEMO_PASSWORD } from '../auth/auth.constants';
import { hashPassword } from '../users/password';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(AddressEntity)
    private readonly addresses: Repository<AddressEntity>,
    @InjectRepository(ProductEntity)
    private readonly products: Repository<ProductEntity>,
    @InjectRepository(OrderEntity)
    private readonly orders: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly items: Repository<OrderItemEntity>,
  ) {}

  async onModuleInit() {
    if ((await this.users.count()) > 0) {
      await this.ensurePasswords();
      await this.ensureDemoRoles();
      await this.ensureDemoAddress();
      return;
    }

    const passwordHash = await hashPassword(DEMO_PASSWORD);

    const [home] = await this.addresses.save([
      {
        id: 1,
        street: 'Rua das Oliveiras',
        cep: '01310-100',
        number: '120',
        complement: 'Apto 42',
        city: 'São Paulo',
        uf: 'SP',
      },
    ]);

    await this.users.save([
      {
        id: 1,
        name: 'Ana Silva',
        email: 'ana@example.com',
        passwordHash,
        role: 'admin',
        addressId: home.id,
      },
      {
        id: 2,
        name: 'Bruno Costa',
        email: 'bruno@example.com',
        passwordHash,
        role: 'partner',
        addressId: null,
      },
    ]);

    await this.products.save([
      {
        id: 1,
        name: 'Oliveira em vaso sage',
        price: 248,
        discount: 0,
        stock: 12,
        imageUrl: 'https://picsum.photos/seed/oliveira/600/800',
        imageName: 'oliveira-vaso-sage.jpg',
      },
      {
        id: 2,
        name: 'Vaso de cerâmica artesanal',
        price: 186,
        discount: 0,
        stock: 8,
        imageUrl: 'https://picsum.photos/seed/vaso/600/800',
        imageName: 'vaso-ceramica.jpg',
      },
      {
        id: 3,
        name: 'Kit de cuidados',
        price: 92,
        discount: 0,
        stock: 24,
        imageUrl: 'https://picsum.photos/seed/cuidados/600/800',
        imageName: 'kit-cuidados.jpg',
      },
      {
        id: 4,
        name: 'Planta de interior',
        price: 164,
        discount: 0,
        stock: 6,
        imageUrl: 'https://picsum.photos/seed/planta/600/800',
        imageName: 'planta-interior.jpg',
      },
      {
        id: 5,
        name: 'Composição sobre linho',
        price: 210,
        discount: 0,
        stock: 4,
        imageUrl: 'https://picsum.photos/seed/linho/600/800',
        imageName: 'composicao-linho.jpg',
      },
    ]);

    await this.orders.save([
      {
        id: 1,
        orderId: 'VER-1042',
        userId: 1,
        payment: 'Pix',
        status: 'entregue',
        totalPrice: 432,
        createdAt: '2026-08-12',
      },
      {
        id: 2,
        orderId: 'VER-1108',
        userId: 1,
        payment: 'Cartão de crédito',
        status: 'em trânsito',
        totalPrice: 186,
        createdAt: '2026-08-18',
      },
      {
        id: 3,
        orderId: 'VER-1120',
        userId: 2,
        payment: 'Boleto',
        status: 'preparando',
        totalPrice: 164,
        createdAt: '2026-08-21',
      },
    ]);

    await this.items.save([
      {
        id: 1,
        orderId: 1,
        productId: 1,
        name: 'Oliveira em vaso sage',
        price: 248,
        quantity: 1,
        discount: 0,
      },
      {
        id: 2,
        orderId: 1,
        productId: 3,
        name: 'Kit de cuidados',
        price: 92,
        quantity: 2,
        discount: 0,
      },
      {
        id: 3,
        orderId: 2,
        productId: 2,
        name: 'Vaso de cerâmica artesanal',
        price: 186,
        quantity: 1,
        discount: 0,
      },
      {
        id: 4,
        orderId: 3,
        productId: 4,
        name: 'Planta de interior',
        price: 164,
        quantity: 1,
        discount: 0,
      },
    ]);

    await this.resetSequence('users');
    await this.resetSequence('products');
    await this.resetSequence('orders');
    await this.resetSequence('order_items');
    await this.resetSequence('addresses');
    await this.resetSequence('favorites');

    this.logger.log('Database seeded.');
  }

  private async ensurePasswords() {
    const rows = await this.users.find();
    const missing = rows.filter((user) => !user.passwordHash);

    if (missing.length === 0) {
      return;
    }

    const passwordHash = await hashPassword(DEMO_PASSWORD);

    for (const user of missing) {
      user.passwordHash = passwordHash;
      await this.users.save(user);
    }

    this.logger.log(`Password hash set for ${missing.length} existing user(s).`);
  }

  private async ensureDemoRoles() {
    const assignments = [
      { email: 'ana@example.com', role: 'admin' as const },
      { email: 'bruno@example.com', role: 'partner' as const },
    ];

    for (const assignment of assignments) {
      const user = await this.users.findOneBy({ email: assignment.email });
      if (user && user.role !== assignment.role) {
        user.role = assignment.role;
        await this.users.save(user);
      }
    }
  }

  private async ensureDemoAddress() {
    const ana = await this.users.findOneBy({ email: 'ana@example.com' });
    if (!ana || ana.addressId) {
      return;
    }

    const address = await this.addresses.save(
      this.addresses.create({
        street: 'Rua das Oliveiras',
        cep: '01310-100',
        number: '120',
        complement: 'Apto 42',
        city: 'São Paulo',
        uf: 'SP',
      }),
    );
    ana.addressId = address.id;
    await this.users.save(ana);
  }

  private async resetSequence(table: string) {
    await this.dataSource.query(
      `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1))`,
    );
  }
}
