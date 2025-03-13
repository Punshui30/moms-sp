import axios from 'axios';

class BackupService {
  private readonly apiUrl = '/api/backup';

  async createBackup(data: any): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/create`, {
        data
      });

      return response.status === 200;
    } catch (error) {
      console.error('Backup failed:', error);
      return false;
    }
  }

  async verifyBackup(timestamp: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.apiUrl}/verify/${timestamp}`);
      return response.status === 200;
    } catch (error) {
      console.error('Backup verification failed:', error);
      return false;
    }
  }

  async getBackupStatus(): Promise<{
    lastBackup: string;
    status: 'success' | 'failed' | 'in_progress';
    host?: string;
  }> {
    try {
      const response = await axios.get(`${this.apiUrl}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get backup status:', error);
      throw error;
    }
  }
}

export const backupService = new BackupService();