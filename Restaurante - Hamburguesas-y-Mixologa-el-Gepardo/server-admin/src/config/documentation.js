import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Restaurante El Gepardo",
            version: "1.0.0",
            description: "API completa para gestión de restaurantes, pedidos, reservas y usuarios",
            contact: {
                name: "Luis Fernando",
                email: "luis@test.com"
            }
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        email: { type: "string" },
                        password: { type: "string" },
                        role: { type: "string" }
                    }
                },
                Restaurant: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        address: { type: "string" }
                    }
                },
                MenuItem: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        price: { type: "number" },
                        restaurant: { type: "string" }
                    }
                },
                Table: {
                    type: "object",
                    properties: {
                        number: { type: "number" },
                        capacity: { type: "number" }
                    }
                },
                Order: {
                    type: "object",
                    properties: {
                        table: { type: "string" },
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    menuItem: { type: "string" },
                                    quantity: { type: "number" }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./server.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };