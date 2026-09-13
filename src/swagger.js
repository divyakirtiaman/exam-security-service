import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Exam Security & Integrity Service",
      version: "1.0.0",
      description:
        "API documentation for Exam Security & Integrity Service"
    },

    servers: [
      {
        url: "http://localhost:3000"
      }
    ],

    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key"
        }
      }
    },

    security: [
      {
        ApiKeyAuth: []
      }
    ]
  },

  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
