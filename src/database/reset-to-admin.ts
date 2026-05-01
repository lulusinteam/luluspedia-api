import { AppDataSource } from './data-source';
import { RoleEntity } from '../modules/roles/infrastructure/persistence/relational/entities/role.entity';
import { RoleEnum } from '../modules/roles/roles.enum';
import { StatusEntity } from '../modules/statuses/infrastructure/persistence/relational/entities/status.entity';
import { StatusEnum } from '../modules/statuses/statuses.enum';
import { UserEntity } from '../modules/users/infrastructure/persistence/relational/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function resetToAdmin() {
  console.log('🚀 Resetting database to Admin only...');

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // 1. Drop all tables
    console.log('📉 Dropping schema...');
    await AppDataSource.dropDatabase();

    // 2. Run Migrations
    console.log('🏗️ Re-creating schema via migrations...');
    await AppDataSource.runMigrations();

    // 3. Seed Roles
    console.log('🌱 Seeding Roles...');
    const roleRepo = AppDataSource.getRepository(RoleEntity);
    await roleRepo.save([
      { id: RoleEnum.admin, name: 'Admin' },
      { id: RoleEnum.user, name: 'User' },
    ]);

    // 4. Seed Statuses
    console.log('🌱 Seeding Statuses...');
    const statusRepo = AppDataSource.getRepository(StatusEntity);
    await statusRepo.save([
      { id: StatusEnum.active, name: 'Active' },
      { id: StatusEnum.inactive, name: 'Inactive' },
    ]);

    // 5. Seed Admin
    console.log('👤 Seeding Admin User...');
    const userRepo = AppDataSource.getRepository(UserEntity);
    const salt = await bcrypt.genSalt();
    const adminPassword = process.env.ADMIN_PASSWORD || 'secret';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = await bcrypt.hash(adminPassword, salt);

    await userRepo.save(
      userRepo.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: adminEmail,
        password,
        role: { id: RoleEnum.admin },
        status: { id: StatusEnum.active },
      }),
    );

    console.log('--------------------------------------------------');
    console.log('✅ Database reset to Admin only successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

void resetToAdmin();
