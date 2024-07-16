import express, { Express } from "express";
import { apiRouter } from "./routes";
import {mongoose} from '@typegoose/typegoose';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import * as YAML from 'yamljs';
import * as path from "node:path";
import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPIV3 } from 'openapi-types';

const app: Express = express();
const port = 8080;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB. Check the README on how to run the database.', error);
});

// Load the YAML file and cast it to the appropriate type
const loadedYaml = YAML.load(path.resolve(__dirname, './schemas/schemasGroup.yaml'));

// Ensure loadedYaml is of type OpenAPIV3.Document
const swaggerDefinition: OpenAPIV3.Document = loadedYaml as OpenAPIV3.Document;

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts']
};

const swaggerDocs = swaggerJsdoc(options);



let api: OpenAPIV3.Document | undefined;
SwaggerParser.validate(swaggerDefinition)
    .then((apiSpec) => {
      api = apiSpec as OpenAPIV3.Document;
      console.log('API name: %s, Version: %s', api.info.title, api.info.version);
    })
    .catch((err) => {
      console.error(err);
    });

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/", apiRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
