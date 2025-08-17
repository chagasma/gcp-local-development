import { FastifyInstance } from 'fastify';
import { storage, firestore, pubsub } from '../services/gcp-clients';

export async function uploadRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' });
      }

      const fileName = `uploads/${Date.now()}-${data.filename}`;
      const fileContent = await data.toBuffer();

      const uploadResponse = await fetch(`http://storage:4443/upload/storage/v1/b/test-bucket/o?uploadType=media&name=${encodeURIComponent(fileName)}`, {
        method: 'POST',
        headers: {
          'Content-Type': data.mimetype || 'application/octet-stream',
        },
        body: fileContent
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const metadata = {
        fileName,
        originalName: data.filename,
        contentType: data.mimetype,
        size: fileContent.length,
        uploadedAt: new Date().toISOString(),
        processed: false
      };

      const docRef = await firestore.collection('uploads').add(metadata);

      try {
        const topic = pubsub.topic('file-uploaded');
        await topic.publishMessage({
          data: Buffer.from(JSON.stringify({
            fileId: docRef.id,
            fileName,
            bucket: 'test-bucket'
          }))
        });
      } catch (pubsubError) {
        console.log('Pub/Sub not available, skipping notification');
      }

      return {
        success: true,
        fileId: docRef.id,
        fileName,
        message: 'File uploaded and saved to Firestore'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Upload failed', details: error instanceof Error ? error.message : String(error) });
    }
  });
}