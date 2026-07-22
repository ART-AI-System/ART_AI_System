import databaseService from './src/services/database.service';
import { hashPassword } from './src/constants/crypto';

async function check() {
  await databaseService.connect();
  const users = await databaseService.users.find({}).toArray();
  console.log('--- USERS IN DB ---');
  users.forEach((u: any) => {
    console.log(`Email: ${u.email} | User: ${u.username} | Code: ${u.studentCode} | Role: ${u.role}`);
    console.log(`  stored passwordHash: ${u.passwordHash || u.password}`);
  });
  console.log('--- GENERATED HASHES ---');
  console.log('Hash of "Password@123":', hashPassword('Password@123'));
  console.log('Hash of "123456":', hashPassword('123456'));
  process.exit(0);
}

check();
