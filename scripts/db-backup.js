const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function getBackupPath(name) {
  return path.join(BACKUP_DIR, `${name}_${TIMESTAMP}`);
}

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    console.error(error.message);
    return false;
  }
}

function backup() {
  console.log('Starting database backup...');
  ensureBackupDir();

  const backupPath = getBackupPath('backup');
  const command = `mongodump --uri="${process.env.MONGODB_URI}" --out="${backupPath}"`;

  if (runCommand(command)) {
    console.log(`Backup completed successfully: ${backupPath}`);
  } else {
    console.error('Backup failed');
    process.exit(1);
  }
}

function restore(backupName) {
  console.log('Starting database restore...');

  const backupPath = path.join(BACKUP_DIR, backupName);
  if (!fs.existsSync(backupPath)) {
    console.error(`Backup not found: ${backupPath}`);
    process.exit(1);
  }

  const command = `mongorestore --uri="${process.env.MONGODB_URI}" "${backupPath}"`;

  if (runCommand(command)) {
    console.log('Restore completed successfully');
  } else {
    console.error('Restore failed');
    process.exit(1);
  }
}

function listBackups() {
  console.log('Available backups:');
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('No backups found');
    return;
  }

  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.startsWith('backup_'))
    .sort((a, b) => b.localeCompare(a));

  if (backups.length === 0) {
    console.log('No backups found');
    return;
  }

  backups.forEach(backup => {
    const stats = fs.statSync(path.join(BACKUP_DIR, backup));
    console.log(`${backup} - ${stats.size} bytes - ${stats.mtime}`);
  });
}

function main() {
  const command = process.argv[2];
  const backupName = process.argv[3];

  switch (command) {
    case 'backup':
      backup();
      break;
    case 'restore':
      if (!backupName) {
        console.error('Backup name is required for restore');
        process.exit(1);
      }
      restore(backupName);
      break;
    case 'list':
      listBackups();
      break;
    default:
      console.error('Invalid command. Use: backup, restore, or list');
      process.exit(1);
  }
}

main(); 