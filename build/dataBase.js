"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.appDataSource = new typeorm_1.DataSource({
    type: "mssql",
    host: "127.0.0.1",
    port: 1433,
    username: "pepperoni",
    password: "310152Po",
    database: "DIARS_PROYECTO",
    synchronize: true,
    logging: false,
    entities: ["src/entities/*.ts"],
    subscribers: [],
    migrations: [],
    options: {
        trustServerCertificate: true
    }
});
