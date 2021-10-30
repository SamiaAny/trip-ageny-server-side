const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wiin6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("tripAgency");
        const packageCollection = database.collection("packages");
        const bookingCollection = database.collection("allbookings");

        console.log('connect server');
        //GET API FOR LOAD ALL PACKAGES
        app.get('/packages',async (req,res)=> {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            // console.log('all',packages);
            res.send(packages); 
        })

        //GET API FOR SINGLE API
        app.get('/packages/:id', async (req,res)=>{
            console.log(req.params.id);
            const id = req.params.id;

            const query = {_id:ObjectId(id)};
            const package = await packageCollection.findOne(query);
            // console.log(package);
            res.json(package);

        });
        //POST API FOR INSERT PACKAGES
        app.post('/packages',async (req,res)=> {
            console.log(req.body);
            const newPackage = req.body;
            const addPackage = await packageCollection.insertOne(newPackage);
            // console.log(addPackage);
            res.json(addPackage);
        })

        //POST API FOR INSERT BOOKINGS
        app.post('/allBookings', async (req,res)=> {
            console.log(req.body);
            const newBooking = req.body;
            const result = await bookingCollection.insertOne(newBooking);
            // console.log(result);
            res.json(result);
        });

        //Get API FOR MANAGE ALL BOOKINGS
        app.get('/allBookings',async (req,res)=> {
            const result = bookingCollection.find({});
            const allBookings = await result.toArray();
            // console.log(allBookings);
            res.send(allBookings);
        });

        //GET API FOR INDIVIDUAL EMAIL
        app.get('/allBookings/:email', async (req,res)=>{
            console.log(req.params.email);
            const userEamil = req.params.email;
            const query = {email:userEamil};
            const cursor = bookingCollection.find(query);
            const result = await cursor.toArray();
            // console.log(result);
            res.json(result);
        })

        //DELETE API FOR remove booking info
        app.delete('/allBookings/:id', async (req,res)=> {
            console.log('id',req.params.id);
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            // console.log(result);
            res.json(result);
        });

        app.put('/allBookings/:id', async (req,res)=>{
            console.log(req.params.id);
            const id = req.params.id;

            const filter = {_id:ObjectId(id)};
            const options = { upsert: true };
            // const result = await bookingCollection.findOne(filter);
            // console.log(result);
            // console.log(package);
            const updateDoc = {
                $set: {
                  status: `approved`
                },
              };

              const result = await bookingCollection.updateOne(filter, updateDoc, options);
              console.log(result);
              res.json(result);

        });

        //PUT API FOR PENDING STATUS
        app.put('allBookings/:id', async (req,res)=>{
            const id = req.params.id;
            // const bookDetails = req.body;
            console.log('user pdate',id);
            // console.log(bookDetails);
            res.send('hit');
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    console.log('hit the server');
    res.send('server connnet');
});

app.listen(port,() => {
    console.log('listen to port',port);
})