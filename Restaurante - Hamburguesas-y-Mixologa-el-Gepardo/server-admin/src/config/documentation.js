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

        tags: [
            { name: "Auth", description: "Autenticación de usuarios" },
            { name: "Users", description: "Gestión de usuarios" },
            { name: "Roles", description: "Gestión de roles" },
            { name: "Restaurants", description: "Gestión de restaurantes" },
            { name: "Menu", description: "Gestión de menú" },
            { name: "Reservations", description: "Gestión de reservas" },
            { name: "Tables", description: "Gestión de mesas" },
            { name: "Orders", description: "Gestión de pedidos" },
            { name: "Reports", description: "Reportes del sistema" }
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
                        name: { type: "string", example: "Luis" },
                        email: { type: "string", example: "luis@test.com" },
                        password: { type: "string", example: "123456" },
                        role: { type: "string", example: "ID_ROLE" }
                    }
                },

                Restaurant: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "El Buen Sabor" },
                        address: { type: "string", example: "Ciudad de Guatemala" }
                    }
                },

                MenuItem: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "Hamburguesa" },
                        price: { type: "number", example: 50 },
                        restaurant: { type: "string", example: "ID_RESTAURANTE" }
                    }
                },

                Table: {
                    type: "object",
                    properties: {
                        number: { type: "number", example: 1 },
                        capacity: { type: "number", example: 4 }
                    }
                },

                Order: {
                    type: "object",
                    properties: {
                        table: { type: "string", example: "ID_MESA" },
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    menuItem: { type: "string", example: "ID_PRODUCTO" },
                                    quantity: { type: "number", example: 2 }
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

    
    apis: ["./server.js", "./src/**/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get("/api-docs.json", (req, res) => {
        res.json(swaggerSpec);
    });

    console.log("📄 Swagger listo en:");
    console.log("👉 http://localhost:3000/api-docs");
};