![Juliano Costa](https://raw.githubusercontent.com/julianojcs/julianojcs.github.io/master/apfjuliano.dev.png)
# GraphQL file uploads with Apollo Server 3
A simple Apollo Server upload files enabled with **apollo-server-express** and **graphqlUploadExpress**.

## Project description:
A GraphQL API enabling single files uploads

## Enabling file uploads in Apollo Server
You can add file upload support to Apollo Server via the third-party `graphql-upload` library. This package provides support for the `multipart/form-data` content-type.
New in Apollo Server 3: Apollo Server 3 does not contain a built-in integration with [graphql-upload](https://npm.im/graphql-upload) like in Apollo Server 2. Instead, the instructions below show how to integrate it yourself. You cannot do this with the "batteries-included" `apollo-server` library; you must use a web framework integration such as `apollo-server-express` instead. To implement similar functionality with another Node.js HTTP framework (e.g., Koa), see the [graphql-upload documentation](https://github.com/jaydenseric/graphql-upload) for more information. Some integrations might need to use `graphql-upload`'s `processRequest` directly.

> After install (npm install), create the folder /public/images to receive the uploaded files

* [Apollo Docs](https://www.apollographql.com/docs/apollo-server/data/file-uploads/#gatsby-focus-wrapper)
