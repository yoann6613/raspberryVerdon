// src/routes/api/history/[type]/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { MongoClient } from 'mongodb';


const uri = process.env.MONGO_URI as string;
const dbname = process.env.DB_NAME as string;
const archive_supervision = process.env.ARCHIVE_SUPERVISION as string;


const client = new MongoClient(uri);
const db = client.db(dbname);
const collection = db.collection(archive_supervision);

export const GET: RequestHandler = async ({ params }) => {
  const type = params.type!;

  const fieldMap = {
    date: 'timestamp',
    temps_chauffe: 'chauffe_eau_temps_chauffe',
    cave: 'chauffe_eau_temperature_cave',
    interieur: 'temperature_interieure',
    cpu: 'temperature_cpu_pi_zero'
  };

  if (!(type in fieldMap)) {
    return new Response(JSON.stringify({ error: 'Type invalide' }), { status: 400 });
  }

  const field = fieldMap[type as keyof typeof fieldMap];

  const docs = await collection.find({ [field]: { $exists: true } })
    .sort({ timestamp: -1 })
    .limit(50)
    .toArray();

  const result = docs.map(doc => ({
    timestamp: doc.timestamp,
    value: doc[field]
  }));

  return new Response(JSON.stringify(result), { status: 200 });
};
