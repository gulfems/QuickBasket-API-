import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'QuickBasket API',
            version: '1.0.0',
            description: 'A rapid grocery delivery REST API'
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Development server' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [path.join(__dirname, '../routes/*.js')]
};

export const swaggerSpec = swaggerJsdoc(options);