import { FastifyInstance } from 'fastify';
import { firestore } from '../services/gcp-clients';

export async function firestoreRoutes(fastify: FastifyInstance) {
  fastify.get('/uploads', async (request, reply) => {
    try {
      const snapshot = await firestore.collection('uploads').get();
      const uploads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { uploads };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch uploads' });
    }
  });

  fastify.get('/uploads/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const doc = await firestore.collection('uploads').doc(id).get();
      
      if (!doc.exists) {
        return reply.code(404).send({ error: 'Upload not found' });
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch upload' });
    }
  });

  fastify.post('/process/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      await firestore.collection('uploads').doc(id).update({
        processed: true,
        processedAt: new Date().toISOString()
      });
      
      return { success: true, message: 'File marked as processed' };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to process file' });
    }
  });
}