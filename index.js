const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qemc4ul.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const jobCollection = client.db('jobDB').collection('job');

        app.get('/job', async (req, res) => {
            const cursor = jobCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobCollection.findOne(query);
            res.send(result);
        })

        app.post('/job', async (req, res) => {
            const newJob = req.body;
            console.log(newJob);
            const result = await jobCollection.insertOne(newJob);
            res.send(result);
        })

        app.put('/job/:id', async (req, res) => {
            const id = req.params.id;
            const job = req.body;
            console.log(id, job);
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updateJob = {
                $set: {
                    email: job.email,
                    jobTitle: job.jobTitle,
                    deadLine: job.deadLine,
                    category: job.category,
                    description: job.description,
                    minimumPrice: job.minimumPrice,
                    maximumPrice: job.maximumPrice,
                }
            }
            const result = await jobCollection.updateOne(filter, updateJob, option);
            res.send(result)
        })

        app.delete('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
        <title>JobQ Server</title>
        <style>
            body {
                font-family: Monospace;
                background-color: #f0f0f0;
                text-align: center;
            }

            .container {
                margin: 50px;
                padding: 100px;
                background-color:#E4EEFF;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }

            h1 {
                color: #000000;
                font-size: 40px;
            }
            p {
                font-size: 20px;
                font-weight: bold;
                margin: 30px;
            }
            .button-link {
                text-decoration: none;
                background-color: #216974;
                color: #fff;
                padding: 10px 20px;
                border-radius: 5px;
                transition: background-color 0.3s; /* Add transition for smooth effect */
            }
            .button-link:hover {
                background-color:#000000; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>JobQ Server Is Running...</h1>
            <p><a class="button-link" href="/job">Go to jobs page</a></p>
        </div>
    </body>
    </html>`)
})

app.listen(port, () => {
    console.log(`JobQ Server Is Running On Port ${port}`)
})