const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management SaaS API",
      version: "1.0.0",
      description: "API documentation for Task Management SaaS Backend",
    },
  },
  apis: ["./routes/*.js"], // Points to your routes folder for JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwaggerDocs;
