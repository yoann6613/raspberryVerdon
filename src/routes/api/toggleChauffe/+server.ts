import { MongoClient, ObjectId } from 'mongodb';
import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI as string;
const dbName = process.env.DB_NAME as string;
const controleCollection = process.env.CONTROLE_COLLECTION as string;

async function updateRadiator() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(controleCollection);


    const objectId = new ObjectId('67d57c53b9f41d664235ceb2');

    console.log(`Recherche du document avec ID: ${objectId}`);

    const document = await collection.findOne({ _id: objectId });

    let newRadiatorValue;

    if (!document) {
      console.log("Document non trouvé, création d'un nouveau avec bit 5 activé.");
      newRadiatorValue = 0b100000;

      const result = await collection.insertOne({
        _id: objectId,
        controle_document: newRadiatorValue,
      });

      if (result.acknowledged) {
        console.log('Document créé avec succès.');
      } else {
        console.log('Erreur lors de la création du document.');
      }
    } else {
      newRadiatorValue = document.controle_document ^ 0b100000;

      const result = await collection.updateOne(
        { _id: objectId },
        { $set: { controle_document: newRadiatorValue } },
        { upsert: true } // Upsert au cas où le document est supprimé pendant l'opération
      );

      if (result.modifiedCount > 0 || result.upsertedCount > 0) {
        console.log('Radiateur mis à jour ou document créé.');
      } else {
        console.log('Aucune modification effectuée.');
      }
    }

    console.log(`Nouvelle valeur de controle_document: ${newRadiatorValue}`);
    return { success: true, controle_document: newRadiatorValue };

  } catch (error) {
    console.error('Erreur lors de la mise à jour du radiateur:', error);
    return { success: false, error: 'Erreur lors de la mise à jour du controle_document' };
  } finally {
    await client.close();
  }
}

export async function POST() {
  const result = await updateRadiator();

  return result.success
    ? json({ controle_document: result.controle_document }, { status: 200 })
    : json({ error: result.error }, { status: 500 });
}
