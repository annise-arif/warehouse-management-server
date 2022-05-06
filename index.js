const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l4qxy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("wareHouse").collection("carService");
    //data get from mongodb database
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // post
    app.post('/service', async(req, res) =>{
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    // get service by email
    app.get("/serviceByEmail/:email", async (req, res) => {
      const email = req.params.email;
      const query = {email: email}
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get('/service/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // Delete my items and manage items
    app.delete('/service/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });
    

    // use put for update quantity
    app.put('/service/:id', async(req, res) =>{
      const id = req.params.id;
      const {quantity} = req.body;
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
        $set: {quantity: quantity}
      };
      const result = await serviceCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });
    
    // use put method for delivered 1service per click
    app.put('/delivered/:id', async(req, res) =>{
      const id = req?.params?.id;
      const {quantity} = req?.body;
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
        $set: {quantity: quantity}
      };
      const result = await serviceCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    
  } 
  finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
