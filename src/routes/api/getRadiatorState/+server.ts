import { MongoClient, ObjectId } from 'mongodb';
import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI as string;
const dbName = process.env.DB_NAME as string;
const collectionName = process.env.COLLECTION_NAME as string;

async function getRadiatorState() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const objectId = new ObjectId('67d57c53b9f41d664235ceb2');

    console.log(`Recherche du document avec ID: ${objectId}`);

    const document = await collection.findOne({ _id: objectId });

    if (!document) {
      console.log("Document non trouvé, initialisation avec radiateur éteint.");
      return { success: true, controle_document: 0 }; // Radiateur éteint par défaut
    }

    console.log(`État actuel du radiateur: ${document.controle_document}`);
    return { success: true, controle_document: document.controle_document };

  } catch (error) {
    console.error('Erreur lors de la récupération de l’état du radiateur:', error);
    return { success: false, error: 'Erreur lors de la récupération de l’état du radiateur' };
  } finally {
    await client.close();
  }
}

export async function GET() {
  const result = await getRadiatorState();

  return result.success
    ? json({ controle_document: result.controle_document }, { status: 200 })
    : json({ error: result.error }, { status: 500 });
}
