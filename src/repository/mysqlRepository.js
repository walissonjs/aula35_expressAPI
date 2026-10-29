import { pool } from '../infrastructure/mysql.js';
import createId from '../shared/id.js';

const tabelas = {
  users: {
    table: 'users',
    columns: ['id', 'name', 'email', 'password_hash', 'role', 'created_at', 'updated_at'],
    map: (row) => ({ id: row.id, name: row.name, email: row.email, passwordHash: row.password_hash, role: row.role, createdAt: row.created_at, updatedAt: row.updated_at })
  },
  addresses: {
    table: 'addresses',
    columns: ['id', 'user_id', 'street', 'number', 'neighborhood', 'city', 'state', 'zip_code', 'created_at', 'updated_at'],
    map: (row) => ({ id: row.id, userId: row.user_id, street: row.street, number: row.number, neighborhood: row.neighborhood, city: row.city, state: row.state, zipCode: row.zip_code, createdAt: row.created_at, updatedAt: row.updated_at })
  },
  products: {
    table: 'products',
    columns: ['id', 'name', 'description', 'image_url', 'price', 'stock', 'created_at', 'updated_at'],
    map: (row) => ({ id: row.id, name: row.name, description: row.description, imageUrl: row.image_url, price: Number(row.price), stock: row.stock, createdAt: row.created_at, updatedAt: row.updated_at })
  },
  carts: {
    table: 'carts',
    columns: ['id', 'user_id', 'items', 'total', 'created_at', 'updated_at'],
    map: (row) => ({ id: row.id, userId: row.user_id, items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items, total: Number(row.total), createdAt: row.created_at, updatedAt: row.updated_at })
  },
  orders: {
    table: 'orders',
    columns: ['id', 'user_id', 'items', 'total', 'status', 'created_at', 'updated_at'],
    map: (row) => ({ id: row.id, userId: row.user_id, items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items, total: Number(row.total), status: row.status, createdAt: row.created_at, updatedAt: row.updated_at })
  }
};

// Criar uma tabela que vai puxar os dados para o banco
function createMySqlRepository(name) {
  const definition = tabelas[name];
  return {
    async findAll() {
      const [rows] = await pool.query(`SELECT * FROM ${definition.table}`);
      return rows.map(definition.map);
    },
    async findById(id) {
      if (name === 'users') {
        const [rows] = await pool.execute(`
          SELECT u.*, a.id AS address_id, a.street AS address_street, a.number AS address_number,
            a.neighborhood AS address_neighborhood, a.city AS address_city, a.state AS address_state,
            a.zip_code AS address_zip_code, a.created_at AS address_created_at, a.updated_at AS address_updated_at
          FROM users u
          LEFT JOIN addresses a ON a.user_id = u.id
          WHERE u.id = ?
          ORDER BY a.created_at ASC
          LIMIT 1
        `, [id]);
        if (!rows[0]) return null;
        const row = rows[0];
        const user = tabelas.users.map(row);
        if (row.address_id) {
          user.address = tabelas.addresses.map({
            id: row.address_id,
            user_id: row.id,
            street: row.address_street,
            number: row.address_number,
            neighborhood: row.address_neighborhood,
            city: row.address_city,
            state: row.address_state,
            zip_code: row.address_zip_code,
            created_at: row.address_created_at,
            updated_at: row.address_updated_at
          });
        }
        return user;
      }
      const [rows] = await pool.execute(`SELECT * FROM ${definition.table} WHERE id = ? LIMIT 1`, [id]);
      return rows[0] ? definition.map(rows[0]) : null;
    },
    async findByEmail(email) {
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      return rows[0] ? tabelas.users.map(rows[0]) : null;
    },
    async findOneBy(field, value) {
      const allowedFields = { userId: 'user_id', email: 'email' };
      const column = allowedFields[field];
      if (!column) throw new Error(`Campo de busca não permitido: ${field}`);
      const [rows] = await pool.execute(`SELECT * FROM ${definition.table} WHERE ${column} = ? LIMIT 1`, [value]);
      return rows[0] ? definition.map(rows[0]) : null;
    },
    async create(attributes) {
      const now = new Date();
      const item = { id: createId(), createdAt: now, ...attributes };
      const fields = Object.keys(item).map((field) => field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`));
      const values = Object.values(item).map((value) => (Array.isArray(value) ? JSON.stringify(value) : value));
      await pool.execute(`INSERT INTO ${definition.table} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`, values);
      return this.findById(item.id);
    },
    async update(id, attributes) {
      const fields = { ...attributes, updatedAt: new Date() };
      const entries = Object.entries(fields);
      const values = entries.map(([, value]) => (Array.isArray(value) ? JSON.stringify(value) : value));
      const set = entries.map(([field]) => `${field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)} = ?`);
      const [result] = await pool.execute(`UPDATE ${definition.table} SET ${set.join(', ')} WHERE id = ?`, [...values, id]);
      return result.affectedRows ? this.findById(id) : null;
    },
    async delete(id) {
      const [result] = await pool.execute(`DELETE FROM ${definition.table} WHERE id = ?`, [id]);
      return result.affectedRows > 0;
    }
  };
}

export default createMySqlRepository;
