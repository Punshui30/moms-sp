import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Server } from 'socket.io';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3000,
    open: true,
    setupMiddleware: (app) => {
      const io = new Server(app, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          credentials: true,
          allowedHeaders: ["*"]
        }
      });
      
      io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        
        socket.on('newOrder', (data) => {
          console.log('New order received:', data);
          // Handle order processing
        });
        
        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
        });
      });
    }
  },
  preview: {
    port: 3000,
    open: true
  }
});