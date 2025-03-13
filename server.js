import jwt from 'jsonwebtoken';
import cors from 'cors';
import { driverService } from './db/driverService.js';
import { backupService } from './services/serverBackupService.js';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

// Backup endpoints
app.post('/api/backup/create', async (req, res) => {
  try {
    const result = await backupService.createBackup(req.body.data);
    res.json({ success: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/backup/verify/:timestamp', async (req, res) => {
  try {
    const result = await backupService.verifyBackup(req.params.timestamp);
    res.json({ verified: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/backup/status', async (req, res) => {
  try {
    const status = await backupService.getBackupStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});