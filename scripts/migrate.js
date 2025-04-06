const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const migrationsDir = path.join(__dirname, '..', 'migrations');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function getMigrationFiles() {
  try {
    const files = await fs.readdir(migrationsDir);
    return files
      .filter(file => file.endsWith('.js'))
      .sort((a, b) => {
        const numA = parseInt(a.split('_')[0]);
        const numB = parseInt(b.split('_')[0]);
        return numA - numB;
      });
  } catch (error) {
    console.error('Error reading migration files:', error);
    process.exit(1);
  }
}

async function runMigration(file) {
  try {
    const migration = require(path.join(migrationsDir, file));
    console.log(`Running migration: ${file}`);
    await migration.up();
    console.log(`Completed migration: ${file}`);
  } catch (error) {
    console.error(`Error running migration ${file}:`, error);
    process.exit(1);
  }
}

async function main() {
  const command = process.argv[2];
  const migrationName = process.argv[3];

  if (!['up', 'down', 'create'].includes(command)) {
    console.error('Invalid command. Use: up, down, or create');
    process.exit(1);
  }

  if (command === 'create' && !migrationName) {
    console.error('Migration name is required for create command');
    process.exit(1);
  }

  if (command === 'create') {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const fileName = `${timestamp}_${migrationName}.js`;
    const filePath = path.join(migrationsDir, fileName);

    const template = `module.exports = {
  async up() {
    // Add migration code here
  },

  async down() {
    // Add rollback code here
  }
};
`;

    try {
      await fs.mkdir(migrationsDir, { recursive: true });
      await fs.writeFile(filePath, template);
      console.log(`Created migration file: ${fileName}`);
    } catch (error) {
      console.error('Error creating migration file:', error);
      process.exit(1);
    }
    return;
  }

  await connectDB();

  if (command === 'up') {
    const files = await getMigrationFiles();
    for (const file of files) {
      await runMigration(file);
    }
  } else if (command === 'down') {
    const files = await getMigrationFiles();
    for (const file of files.reverse()) {
      const migration = require(path.join(migrationsDir, file));
      console.log(`Rolling back migration: ${file}`);
      await migration.down();
      console.log(`Rolled back migration: ${file}`);
    }
  }

  await mongoose.connection.close();
  console.log('Migration completed successfully');
}

main(); 