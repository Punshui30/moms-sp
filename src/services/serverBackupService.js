import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { join } from 'path';
import Client from 'ssh2-sftp-client';
import { createReadStream } from 'fs';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { config } from '../config';

const execAsync = promisify(exec);

class ServerBackupService {
  constructor() {
    this.config = {
      host: config.backup.host,
      port: parseInt(config.backup.port),
      username: config.backup.username,
      privateKey: createReadStream(config.backup.sshKey)
    };
  }

  async createBackup(data) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `backup-${timestamp}.tar.gz`;
      const tempPath = join('/tmp', `data-${timestamp}.json`);

      // Write data to temp file
      await fs.writeFile(tempPath, JSON.stringify(data));

      // Initialize SFTP client
      const sftp = new Client();
      await sftp.connect(this.config);

      // Create backup stream
      const gzip = createGzip();
      const source = createReadStream(tempPath);

      // Upload through SFTP
      await pipeline(
        source,
        gzip,
        sftp.createWriteStream(join(config.backup.path, backupName))
      );

      // Cleanup temp file
      await fs.unlink(tempPath);
      await sftp.end();

      return true;
    } catch (error) {
      console.error('Backup failed:', error);
      return false;
    }
  }

  async verifyBackup(timestamp) {
    try {
      const sftp = new Client();
      await sftp.connect(this.config);
      
      const stats = await sftp.stat(join(config.backup.path, `backup-${timestamp}.tar.gz`));
      await sftp.end();
      
      return stats !== false;
    } catch (error) {
      console.error('Backup verification failed:', error);
      return false;
    }
  }

  async getBackupStatus() {
    try {
      const sftp = new Client();
      await sftp.connect(this.config);
      
      const list = await sftp.list(config.backup.path);
      await sftp.end();
      
      const lastBackup = list
        .filter(item => item.name.startsWith('backup-'))
        .sort((a, b) => b.modifyTime - a.modifyTime)[0];

      return {
        lastBackup: lastBackup?.name.replace('backup-', '').replace('.tar.gz', ''),
        status: lastBackup ? 'success' : 'failed',
        host: config.backup.host
      };
    }
    catch (error) {
      console.error('Failed to get backup status:', error);
      return { lastBackup: null, status: 'failed', host: config.backup.host };
    }
  }
}

export const backupService = new ServerBackupService();