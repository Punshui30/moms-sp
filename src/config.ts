export const config = {
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN,
  socketUrl: import.meta.env.VITE_SOCKET_URL,
  jwtSecret: import.meta.env.VITE_JWT_SECRET,
  backup: {
    host: import.meta.env.DO_HOST || 'your-vps-ip',
    username: import.meta.env.DO_USERNAME || 'root',
    port: import.meta.env.DO_PORT || '22',
    path: import.meta.env.DO_BACKUP_PATH || '/root/backups',
    sshKey: import.meta.env.DO_SSH_KEY || 'C:/Windows/System32/id_rsa'
  }
} as const;
