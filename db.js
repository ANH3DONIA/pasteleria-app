import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

let db;

if (process.env.MYSQL_HOST && process.env.MYSQL_HOST !== 'localhost') {
    console.log("Conectando a MySQL...");
    db = await mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB,
    });
} else {
    console.log("Conectando a SQLite para pruebas locales...");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dbPath = path.join(__dirname, 'pasteleria.db');
    
    const isNewDb = !fs.existsSync(dbPath);
    const { default: Database } = await import('better-sqlite3');
    const sqlite = new Database(dbPath);
    
    sqlite.pragma('foreign_keys = ON');

    if (isNewDb) {
        console.log("Creando tablas locales en SQLite...");
        sqlite.exec(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre VARCHAR(100) NOT NULL,
                descripcion TEXT,
                precio DECIMAL(10, 2) NOT NULL,
                imagen VARCHAR(255),
                categoria VARCHAR(50)
            );
            CREATE TABLE IF NOT EXISTS pedidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                estado TEXT CHECK(estado IN ('pendiente', 'procesando', 'enviado', 'entregado')) DEFAULT 'pendiente',
                fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS pedidos_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pedido_id INTEGER NOT NULL,
                producto_id INTEGER NOT NULL,
                cantidad INTEGER NOT NULL,
                precio_unitario DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
            );
            INSERT INTO productos (nombre, descripcion, precio, imagen, categoria) VALUES
            ('Pastel de Chocolate Premium', 'Un delicioso pastel de chocolate con glaseado de ganache, elegantes rizos de chocolate y capas húmedas que se deshacen en la boca.', 35.00, '/equipo_12/images/chocolate_cake.png', 'pasteles'),
            ('Tarta de Frutas Frescas', 'Exquisita tarta con base mantecosa, rellena de crema pastelera de vainilla y coronada con un arreglo de bayas coloridas y kiwi.', 28.50, '/equipo_12/images/fruit_tart.png', 'tartas'),
            ('Pastel de Boda Elegante', 'Elegante pastel en pisos con fondant blanco, decorado con delicadas flores de azúcar en tonos pastel, ideal para tu celebración perfecta.', 250.00, '/equipo_12/images/wedding_cake.png', 'pasteles'),
            ('Cheesecake de Frambuesa', 'Cremoso cheesecake estilo Nueva York con un toque de vainilla, cubierto con un coulis casero de frambuesas frescas.', 30.00, '/equipo_12/images/cheesecake.png', 'tartas'),
            ('Croissants Artesanales', 'Auténticos croissants hojaldrados y dorados, horneados cada mañana con la mejor mantequilla francesa.', 4.50, '/equipo_12/images/croissants.png', 'postres'),
            ('Macarons Surtidos', 'Caja de delicados macarons en sabores variados: vainilla de Madagascar, pistacho, frambuesa y chocolate negro.', 15.00, '/equipo_12/images/macarons.png', 'postres'),
            ('Pastel de Zanahoria', 'Esponjoso pastel de zanahoria con nuez, especias de canela y jengibre, cubierto con un generoso betún de queso crema.', 32.00, '/equipo_12/images/carrot_cake.png', 'pasteles'),
            ('Naked Cake de Frutos Rojos', 'Rústico pastel sin cobertura con capas visibles de bizcocho esponjoso, crema batida y abundantes fresas, frambuesas y moras.', 45.00, '/equipo_12/images/naked_cake.png', 'pasteles'),
            ('Tarta de Limón y Merengue', 'Base crujiente rellena de una crema de limón intensamente ácida, coronada con picos de merengue italiano tostado al momento.', 26.00, '/equipo_12/images/lemon_tart.png', 'tartas'),
            ('Tarta de Manzana Caramelizada', 'Clásica tarte tatin con manzanas golden caramelizadas en mantequilla y azúcar morena sobre una base de hojaldre dorado.', 24.00, '/equipo_12/images/apple_tart.png', 'tartas'),
            ('Tiramisú Clásico', 'Auténtico tiramisú italiano con capas de savoiardi bañados en espresso, crema de mascarpone y un generoso toque de cacao.', 22.00, '/equipo_12/images/tiramisu.png', 'postres'),
            ('Cupcakes Red Velvet (6 pzas)', 'Seis esponjosos cupcakes de terciopelo rojo con una nube de betún de queso crema y decoración artesanal. Perfectos para regalar.', 18.00, '/equipo_12/images/red_velvet_cupcakes.png', 'postres');
        `);
    }

    db = {
        query: async (sql, params) => {
            const stmt = sqlite.prepare(sql);
            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                return [stmt.all(...(params || []))];
            } else {
                const info = stmt.run(...(params || []));
                return [{ insertId: info.lastInsertRowid, affectedRows: info.changes }];
            }
        },
        execute: async (sql, params) => db.query(sql, params),
        getConnection: async () => ({
            beginTransaction: async () => sqlite.exec('BEGIN TRANSACTION'),
            commit: async () => sqlite.exec('COMMIT'),
            rollback: async () => sqlite.exec('ROLLBACK'),
            execute: async (sql, params) => db.query(sql, params),
            release: () => {}
        })
    };
}

export default db;
