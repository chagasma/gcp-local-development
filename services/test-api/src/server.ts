import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import { initializeClients } from './services/gcp-clients';
import { uploadRoutes } from './routes/upload';
import { firestoreRoutes } from './routes/firestore';
import { storageRoutes } from './routes/storage';

const fastify = Fastify({
  logger: true
});

fastify.register(multipart);

async function start() {
  try {
    await initializeClients();
    
    fastify.register(uploadRoutes, { prefix: '/api/upload' });
    fastify.register(firestoreRoutes, { prefix: '/api/firestore' });
    fastify.register(storageRoutes, { prefix: '/api/storage' });

    fastify.get('/health', async (request, reply) => {
      return { status: 'healthy', timestamp: new Date().toISOString() };
    });

    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Server running on http://0.0.0.0:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();