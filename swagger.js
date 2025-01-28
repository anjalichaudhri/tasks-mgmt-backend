const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "task Management SaaS Backend",
            version: "1.0.0",
            description: "API documentation for the Task Management SaaS Backend",
        },
    },
    apis: ["./server.js"], // Path to your API documentation in JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = app => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};