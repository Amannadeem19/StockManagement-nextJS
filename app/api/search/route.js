import {MongoClient} from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET (request){
    const query  = request.nextUrl.searchParams.get('query');
    // Replace the uri string with your connection string.  
  const uri = "mongodb+srv://aman:aman@nodeexpressprojects.cqjvq7j.mongodb.net/";
  const client = new MongoClient(uri);
  
  try {
    const database = client.db('StockManagement');
    const inventory = database.collection('Inventory');
    const products = await inventory.aggregate([{
        $match:{
            $or:[
                {slug : {$regex : query, $options:"i"}},
            ]
        }
    }]).toArray();
    return NextResponse.json({products});
    
    console.log(products);
  
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  }
  
  
  