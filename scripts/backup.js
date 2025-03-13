import Client from 'ssh2-sftp-client';
import { createReadStream } from 'fs';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';
import path from 'path';

// Load SSH key configuration from environment
const config = {
  host: process.env.DO_HOST,
  port: parseInt(process.env.DO_PORT || '22'),
  username: process.env.DO_USERNAME,
  privateKey: process.env.DO_SSH_KEY 
    ? createReadStream(process.env.DO_SSH_KEY)
    : undefined
};

async function createBackup() {
  const sftp = new Client();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `backup-${timestamp}.tar.gz`;
  
  try {
    console.log('Connecting to remote server...');
    await sftp.connect(config);
    
    // Create backup stream
    const gzip = createGzip();
    const source = createReadStream('db/drivers.db');
    
    console.log('Starting backup transfer...');
    
    // Upload directly through SFTP
    await pipeline(
      source,
      gzip,
      sftp.createWriteStream(path.join(process.env.DO_BACKUP_PATH, backupName))
    );
    
    console.log('Backup completed successfully!');
    console.log(`Backup file: ${backupName}`);
    
    // Verify backup exists
    const stats = await sftp.stat(path.join(process.env.DO_BACKUP_PATH, backupName));
    console.log(`Backup size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    
    return true;
  } catch (err) {
    console.error('Backup failed:', err.message);
    return false;
  } finally {
    await sftp.end();
  }
}

// Run backup if called directly
if (process.argv[1] === import.meta.url) {
  createBackup()
    .then(success => process.exit(success ? 0 : 1))
    .catch(() => process.exit(1));
}

export { createBackup };