import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import { PubSub } from '@google-cloud/pubsub';

export let firestore: Firestore;
export let storage: Storage;
export let pubsub: PubSub;

export async function initializeClients() {
  console.log('🔧 Initializing GCP clients for local emulators...');
  
  firestore = new Firestore({
    projectId: 'demo-project',
    host: process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080',
    ssl: false
  });

  storage = new Storage({
    projectId: 'demo-project',
    apiEndpoint: process.env.STORAGE_EMULATOR_HOST || 'http://localhost:4443'
  });

  pubsub = new PubSub({
    projectId: 'demo-project'
  });

  try {
    const bucket = storage.bucket('test-bucket');
    const [exists] = await bucket.exists();
    if (!exists) {
      await bucket.create();
      console.log('📦 Created test-bucket');
    }
  } catch (error) {
    console.log('⚠️ Bucket creation error (may already exist):', error instanceof Error ? error.message : String(error));
  }

  console.log('✅ GCP clients initialized');
}