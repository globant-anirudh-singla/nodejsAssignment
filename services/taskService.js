const { getDb } = require('../database/db');

const getAllTasks = async () => {
  const db = getDb();
  return await db.all('SELECT * FROM tasks');
};

const getTaskById = async (id) => {
  const db = getDb();
  return await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
};

const createTask = async (title, completed) => {
  const db = getDb();
  const result = await db.run('INSERT INTO tasks (title, completed) VALUES (?, ?)', [title, completed]);
  return await getTaskById(result.lastID);
};

const updateTask = async (id, title, completed) => {
  const db = getDb();
  const entries = Object.entries(updateFields);
  
  // Building the SQL query dynamically based on the fields provided
  const setClause = entries.map(([key, value], index) => `${key} = $${index + 1}`).join(', ');
  const values = entries.map(([, value]) => value);

  if (entries.length === 0) {
    throw ApiError.badRequest('No valid fields provided for update');
  }

  const stmt = `UPDATE tasks SET ${setClause} WHERE id = ?`;
  values.push(id); // Add the task ID as the last parameter for the WHERE clause

  const result = await db.run(stmt, values);
  if (result.changes === 0) {
    throw ApiError.notFound(`Task with id ${id} not found`);
  }

  return await getTaskById(id);
};

const deleteTask = async (id) => {
  const db = getDb();
  return await db.run('DELETE FROM tasks WHERE id = ?', [id]);
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
