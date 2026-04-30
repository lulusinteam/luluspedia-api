import { DataSource } from 'typeorm';
import { UserEntity } from '../../../modules/users/infrastructure/persistence/relational/entities/user.entity';
import { RoleEnum } from '../../../modules/roles/roles.enum';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

/**
 * Seed script for production that creates a single admin user.
 * It deletes any existing admin accounts before inserting a fresh one
 * to guarantee idempotency.
 */
export async function seedAdmin(dataSource: DataSource) {
  const repo = dataSource.getRepository(UserEntity);

  // Remove all existing users and dependent data (sessions, tryouts, etc.) to ensure a fresh state
  await dataSource.query('TRUNCATE TABLE "users" CASCADE;');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const hashed = await bcrypt.hash(adminPassword, 10);

  const admin = repo.create({
    email: adminEmail,
    password: hashed,
    role: {
      id: RoleEnum.admin,
    },
    firstName: 'Admin',
    lastName: 'System',
    provider: 'email',
  });

  await repo.save(admin);
  console.log('✅ Production admin user seeded');
}

// When executed directly (node dist/...)
if (require.main === module) {
  void (async () => {
    const { AppDataSource } = await import('../../data-source');
    await AppDataSource.initialize();
    await seedAdmin(AppDataSource);
    await AppDataSource.destroy();
  })();
}
