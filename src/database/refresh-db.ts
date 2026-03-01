import { execSync } from 'child_process';
import 'dotenv/config';

function resetDb() {
  const nodeEnv = process.env.NODE_ENV;

  if (nodeEnv !== 'local') {
    console.error(
      `❌ Error: Database reset is only allowed in 'local' environment. Current environment: '${nodeEnv}'`,
    );
    process.exit(1);
  }

  console.log('🚀 Starting database refresh (local environment)...');

  try {
    console.log('📉 Dropping schema...');
    execSync('npm run schema:drop', { stdio: 'inherit' });

    console.log('🏗️ Running migrations...');
    execSync('npm run migration:run', { stdio: 'inherit' });

    console.log('🌱 Seeding database...');
    execSync('npm run seed:run:relational', { stdio: 'inherit' });

    console.log('✅ Database refreshed successfully!');
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  }
}

void resetDb();
