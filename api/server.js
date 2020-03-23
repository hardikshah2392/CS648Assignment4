/* eslint linebreak-style: ["error", "windows"] */
/* global console */
/* eslint no-restricted-globals: "off" */

const fs = require('fs');
require('dotenv').config();
const express = require('express');

const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://hardikshah:Simple123@mongoproject-o0yje.mongodb.net/test?retryWrites=true';

const port = process.env.API_SERVER_PORT || 3000;
// let aboutMessage = "My Company Inventory";
let db;


async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function addProd(_, { prods }) {
  const newProd = { prods };
  newProd.id = await getNextSequence('products');
  const result = await db.collection('products').insertOne(newProd);
  const savedProd = await db.collection('products').findOne({ _id: result.insertedId });
  return savedProd;
}
// function setAboutMessage(_, { message }) {
//     return aboutMessage = message;
// }
async function prodList() {
  const prods = await db.collection('products').find({}).toArray();
  return prods;
}
async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDb at', url);
  db = client.db();
}

const resolvers = {
  Query: {
    prodList,
  },
  Mutation: {
    addProd,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

// app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });
(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());
