import {MongoClient} from 'mongodb';
import { NextResponse } from 'next/server';


export async function POST (request){
    // Replace the uri string with your connection string.

let prod = await request.json()
console.log(prod);
const uri = "mongodb+srv://aman:aman@nodeexpressprojects.cqjvq7j.mongodb.net/";
const client = new MongoClient(uri);

  try {
    const database = client.db('StockManagement');
    const inventory = database.collection('Inventory');

    const query = {};
    const product = await inventory.insertOne(prod);
    return NextResponse.json({product});
    console.log(product);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function GET (request){
  // Replace the uri string with your connection string.


const uri = "mongodb+srv://aman:aman@nodeexpressprojects.cqjvq7j.mongodb.net/";
const client = new MongoClient(uri);

try {
  const database = client.db('StockManagement');
  const inventory = database.collection('Inventory');

  const query = {};
  const products = await inventory.find(query).toArray();
  return NextResponse.json({products});
  console.log(products);

} finally {
  // Ensures that the client will close when you finish/error
  await client.close();
}
}


