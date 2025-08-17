import { FastifyInstance } from 'fastify';
import { storage } from '../services/gcp-clients';

export async function storageRoutes(fastify: FastifyInstance) {
  fastify.get('/files', async (request, reply) => {
    try {
      const bucket = storage.bucket('test-bucket');
      const [files] = await bucket.getFiles();
      
      const fileList = files.map(file => ({
        name: file.name,
        size: file.metadata?.size || 0,
        contentType: file.metadata?.contentType,
        timeCreated: file.metadata?.timeCreated,
        updated: file.metadata?.updated
      }));
      
      return { files: fileList };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to list files' });
    }
  });

  fastify.get('/files/:fileName', async (request, reply) => {
    try {
      const { fileName } = request.params as { fileName: string };
      const bucket = storage.bucket('test-bucket');
      const file = bucket.file(fileName);
      
      const [exists] = await file.exists();
      if (!exists) {
        return reply.code(404).send({ error: 'File not found' });
      }
      
      const [metadata] = await file.getMetadata();
      const stream = file.createReadStream();
      
      reply.type(metadata.contentType || 'application/octet-stream');
      return reply.send(stream);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to download file' });
    }
  });

  fastify.delete('/files/:fileName', async (request, reply) => {
    try {
      const { fileName } = request.params as { fileName: string };
      const bucket = storage.bucket('test-bucket');
      const file = bucket.file(fileName);
      
      await file.delete();
      
      return { success: true, message: 'File deleted' };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete file' });
    }
  });
}