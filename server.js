const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const path = require('path')
const fs =require('fs')
const shortid =require('shortid')
const AWS = require("aws-sdk");
const stream = require( "stream");
require("dotenv").config();
// s3 config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // your AWS access id
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // your AWS access key
});
// actual function for uploading file
 const createUploadStream = (key,mimetype) => {
  const pass = new stream.PassThrough();
  console.log("key ",key)
  return {
    writeStream: pass,
    promise: s3
      .upload({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        ContentType: mimetype,
        Body: pass,
        ACL: "public-read"
      })
      .promise(),
  };
};
const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    hello: String!
  }

  type Mutation {
    # Multiple uploads are supported. See graphql-upload docs for details.
    singleUpload(file: Upload!): String!
  }
`

const resolvers = {
  // This maps the `Upload` scalar to the implementation provided
  // by the `graphql-upload` package.
  Upload: GraphQLUpload,

  Query: {
    hello: () => 'Hello World!'
  },

  Mutation: {
    singleUpload: async (parent, { file }) => {
      const { filename, createReadStream,mimetype } = await file;
      const stream = createReadStream();

      let result;

      try {
        const uploadStream = createUploadStream(filename,mimetype);
        stream.pipe(uploadStream.writeStream);
        result = await uploadStream.promise;
      } catch (error) {
        console.log(
          `[Error]: Message: ${error.message}, Stack: ${error.stack}`
        );
        throw new ApolloError("Error uploading file");
      }

      return result.Location;
    },

  }
}

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
    debug: true,
    cors: { credentials: true, allowedHeaders: '', origin: '*' },
    context: ({ req, res }) => ({ req, res })
  })
  await server.start()

  const app = express()

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress())

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    next()
  })

  server.applyMiddleware({ app })

  app.use(express.static('public'))

  await new Promise((r) => app.listen({ port: 4000 }, r))

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

startServer()
