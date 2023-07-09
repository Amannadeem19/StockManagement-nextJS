import {MongoClient} from 'mongodb';

import { NextResponse } from 'next/server';


export async function GET (request){
    // Replace the uri string with your connection string.
const uri = "mongodb+srv://aman:aman@nodeexpressprojects.cqjvq7j.mongodb.net/";

const client = new MongoClient(uri);

  try {
    const database = client.db('JOBS');
    const users = database.collection('users');

    // const query = {};
    // const user = await users.find(query).toArray();
     const query = {name : 'mohammad'};
    const user = await users.findOne(query);
    return NextResponse.json(user);
    console.log(user);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


