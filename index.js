const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fkjuk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const goldCollection = client.db('goldStore').collection('gold-collection');
    const bookingCollection = client.db('goldStore').collection('booking');

    app.get('/golds', async (req, res) => {
      const cursor = goldCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/golds/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await goldCollection.findOne(query);
      res.send(result);
    });

    //post booking data to database
    app.post('/booking', async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    //get booking data from database for show booking in ddashboard
    app.get('/booking', async (req, res) => {
      const email = req.query.email;
      const query = {email:email};
      const bookings = await bookingCollection.find(query).toArray;
      res.send(bookings);
  })

   
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send(
    '<h1 style="color:red ; text-align:center ; margin:20% auto">Hello from gold-project</h1>'
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});