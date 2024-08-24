
const express = require('express');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const cors = require('cors');
app.use(cors({
    origin: ["http://localhost:5173", 'https://esthetica-frontend.web.app', 'https://esthetica-frontend.firebaseapp.com'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bogalj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//middlewares
const logger = async (req, res, next) => {
    console.log('called', req.method, req.url)
    next()
}
const verifyToken = async (req, res, next) => {
    const token = req?.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: "Unauthorized Access" })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized Access' })
        }
        req.user = decoded
        next()
    })

}
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
        const serviceCollection = client.db("esthetica_new").collection('services')
        const bookingsCollection = client.db("esthetica_new").collection('bookings')
        //auth related api
        app.post('/jwt', logger, async (req, res) => {
            const user = req.body;
            console.log(user)
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '100d'
            })
            res
                .cookie('token', token, cookieOptions)
                .send({ sucess: true })
        })

        app.post('/logout', async (req, res) => {
            const user = req.body;
            console.log('logging out', user)
            res.clearCookie('token', { ...cookieOptions, maxAge: 0 }).send({ sucess: true })
        })

        // app.get("/services", async (req, res) => {
        //     const filter = req.query;
        //     console.log(filter);
        //     const query = {

        //         title: { $regex: filter.search, $options: 'i' }
        //     };

        //     const options = {
        //         sort: {
        //             price: filter.sort === 'asc' ? 1 : -1
        //         }
        //     };

        //     const cursor = serviceCollection.find(query, options);
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })
        // app.get("/services", async (req, res) => {
        //     const filter = req.query;
        //     console.log(filter);

        //     const query = {
        //         title: { $regex: filter.search, $options: 'i' }
        //     };

        //     const sortOrder = filter.sort === 'asc' ? 1 : -1;

        //     const pipeline = [
        //         { $match: query },
        //         {
        //             $addFields: {
        //                 priceAsNumber: { $toDouble: "$price" }
        //             }
        //         },
        //         { $sort: { priceAsNumber: sortOrder } }
        //     ];

        //     const cursor = serviceCollection.aggregate(pipeline);
        //     const result = await cursor.toArray();
        //     res.send(result);
        // });
        app.get("/services", async (req, res) => {
            try {
                // Get the search filter from query params and ensure it's a string
                const filter = req.query;
                const searchValue = filter.search ? filter.search.toString() : ''; // Ensure search is a string

                // Construct the query using $regex
                const query = {
                    title: { $regex: searchValue, $options: 'i' }
                };

                // Determine the sort order
                const sortOrder = filter.sort === 'asc' ? 1 : -1;

                // Create the aggregation pipeline
                const pipeline = [
                    { $match: query },
                    {
                        $addFields: {
                            priceAsNumber: { $toDouble: "$price" }
                        }
                    },
                    { $sort: { priceAsNumber: sortOrder } }
                ];

                // Execute the aggregation
                const cursor = serviceCollection.aggregate(pipeline);
                const result = await cursor.toArray();

                // Send the result back to the client
                res.send(result);
            } catch (error) {
                // Handle errors
                console.error('Error fetching services:', error);
                res.status(500).send('Server Error');
            }
        });


        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: { title: 1, price: 1, service_id: 1, img: 1 }
            }
            const result = await serviceCollection.findOne(query, options)
            res.send(result)
        })
        //bookings
        app.get("/bookings", logger, verifyToken, async (req, res) => {
            console.log(req.query.email)
            console.log('user in the valid token', req.user)
            if (req.query.email != req.user.email) {
                return res.status(403).send({ message: 'Forbidden Access' })
            }
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingsCollection.find(query).toArray()
            res.send(result)
        })
        app.post("/bookings", async (req, res) => {
            const booking = req.body;
            console.log(booking)
            const result = await bookingsCollection.insertOne(booking)
            res.send(result)
        })
        app.patch("/bookings/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateBooking = req.body
            console.log(updateBooking)

            const updateDoc = {
                $set: {
                    status: updateBooking.status
                }
            }
            const result = await bookingsCollection.updateOne(filter, updateDoc)
            res.send(result)
        })
        app.delete("/bookings/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await bookingsCollection.deleteOne(query)
            res.send(result)
        })

        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is running")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})