import { MongoClient, ObjectId } from 'mongodb';
import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI as string;
const dbName = process.env.DB_NAME as string;
const controleCollection = process.env.CONTROLE_COLLECTION as string;
const supervisionCollection = process.env.SUPERVISION_COLLECTION as string;

async function getRadiatorState() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const controleCol = db.collection(controleCollection);
    const supervisionCol = db.collection(supervisionCollection);

    const objectId = new ObjectId('67d57c53b9f41d664235ceb2');

    console.log(`Recherche du document avec ID: ${objectId}`);

    // Récupérer l'état du radiateur
    const controleDocument = await controleCol.findOne({ _id: objectId });

    // Récupérer les champs chauffe-eau
    const supervisionDocument = await supervisionCol.findOne({});

    if (!controleDocument) {
      console.log("Document de contrôle non trouvé, initialisation avec radiateur éteint.");
      return { success: true, controle_document: 0, temps_chauffe: 0, temperature_cave: 0 };
    }

    // Si le document de supervision est trouvé, récupérer les données
    const temps_chauffe = supervisionDocument?.chauffe_eau_temps_chauffe || 0;
    const temperature_cave = supervisionDocument?.chauffe_eau_temperature_cave || 0;

    console.log(`État actuel du radiateur: ${controleDocument.controle_document}`);
    return { success: true, controle_document: controleDocument.controle_document, temps_chauffe, temperature_cave };

  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return { success: false, error: 'Erreur lors de la récupération des données' };
  } finally {
    await client.close();
  }
}

export async function GET() {
  const result = await getRadiatorState();

  return result.success
    ? json({
        controle_document: result.controle_document,
        temps_chauffe: result.temps_chauffe,
        temperature_cave: result.temperature_cave
      }, { status: 200 })
    : json({ error: result.error }, { status: 500 });
}
