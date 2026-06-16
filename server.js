import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'secreto_super_seguro_123';

app.use(cors());
app.use(express.json());
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(403).json({ mensaje: 'Token inválido o expirado.' });
    }
};

app.post('/registro', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
        }

        const [existing] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.execute(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );

        res.status(201).json({ 
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: result.insertId,
                nombre,
                email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
        }

        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const usuario = rows[0];
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el login', error: error.message });
    }
});

app.get('/productos', async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM productos');
        const productosMapeados = productos.map(p => ({
            id: p.id,
            name: p.nombre,
            description: p.descripcion,
            price: Number(p.precio),
            image: p.imagen,
            category: p.categoria
        }));
        res.json(productosMapeados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
    }
});

app.post('/pedidos', verificarToken, async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { total, items } = req.body;
        
        if (total === undefined || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ mensaje: 'Datos de pedido inválidos' });
        }

        await connection.beginTransaction();

        const [resultPedido] = await connection.execute(
            "INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)",
            [req.usuario.id, total]
        );
        const pedidoId = resultPedido.insertId;

        for (const item of items) {
            await connection.execute(
                "INSERT INTO pedidos_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
                [pedidoId, item.id, item.quantity || item.cantidad, item.price || item.precio]
            );
        }

        await connection.commit();

        res.status(201).json({
            mensaje: 'Pedido creado exitosamente',
            pedidoId
        });
    } catch (error) {
        if (connection) {
            try { await connection.rollback(); } catch(e) {}
        }
        console.error(error);
        // Usamos 400 en lugar de 500 para evitar que Nginx intercepte el error con una página HTML
        res.status(400).json({ mensaje: 'Error en la base de datos (Probablemente falte crear las tablas)', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.get('/pedidos/mis-pedidos', verificarToken, async (req, res) => {
    try {
        const [pedidos] = await db.query(
            'SELECT id, total, estado, fecha FROM pedidos WHERE usuario_id = ? ORDER BY fecha DESC',
            [req.usuario.id]
        );
        res.json(pedidos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
