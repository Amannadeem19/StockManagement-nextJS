import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
export async function POST(request){
    let {slug, action, initialQty} = await request.json();
 
    const uri = "mongodb+srv://aman:aman@nodeexpressprojects.cqjvq7j.mongodb.net/";
    const client = new MongoClient(uri);
    
    try {
        const database = client.db("StockManagement");
        const inventory = database.collection("Inventory");
        const filter = { slug: slug };

        // create a document that sets the plot of the movie
        let newQty;
        if(action == 'plus'){
          newQty = parseInt(initialQty) + 1;
        }else if(action == 'minus' && parseInt(initialQty) > 0){
          newQty = parseInt(initialQty) - 1;
        }else{
         newQty =  parseInt(initialQty) 
        }
        const updateDoc = {
          $set: {
            quantity: newQty
          },
        };
        const product = await inventory.updateOne(filter, updateDoc, {});
          return NextResponse.json({products:`${product.matchedCount} document(s) matched the filter, updated ${product.modifiedCount} document(s)`});
      } finally {
        await client.close();
      }
}