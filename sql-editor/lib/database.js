import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

// Define the path to the persistent SQLite database file.
// process.cwd() gets the current working directory (project root).
const DB_PATH = path.join(process.cwd(), 'sql_editor.db');

/**
 * A wrapper class for SQLite database operations, providing promisified methods
 * and managing a single persistent database connection.
 */
class Database {
  db; // The SQLite database instance.
  initialized = false; // Flag to ensure initialization logic runs only once.

  constructor() {
    // Initialize the database connection.
    // sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE ensures the database
    // is created if it doesn't exist, and is opened for reading and writing.
    this.db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to the SQLite database.');
      }
    });
    // Enable foreign key constraints for better data integrity.
    this.db.run('PRAGMA foreign_keys = ON;');
  }

  /**
   * Initializes the database by creating necessary tables if they don't exist.
   * This method ensures the basic schema for playgrounds and query history is present.
   */
  async init() {
    if (this.initialized) return; // Prevent re-initialization

    // Promisify the db.run method for async/await usage.
    const run = promisify(this.db.run.bind(this.db));
    
    // Create 'playgrounds' table for managing user SQL workspaces.
    await run(`
      CREATE TABLE IF NOT EXISTS playgrounds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_modified DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create 'query_history' table to log executed queries.
    await run(`
      CREATE TABLE IF NOT EXISTS query_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playground_id INTEGER,
        query TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        success BOOLEAN DEFAULT 0,
        error TEXT,
        FOREIGN KEY (playground_id) REFERENCES playgrounds (id) ON DELETE CASCADE
      )
    `);

    this.initialized = true;
    console.log('Database schema initialized.');
  }

  /**
   * Retrieves all playgrounds from the database, ordered by last modified date.
   * @returns {Promise<Array>} A promise that resolves to an array of playground objects.
   */
  async getAllPlaygrounds() {
    await this.init();
    const all = promisify(this.db.all.bind(this.db));
    return await all(`
      SELECT id, title, created_at as createdAt, last_modified as lastModified 
      FROM playgrounds 
      ORDER BY last_modified DESC
    `);
  }

  /**
   * Creates a new playground with the given title.
   * @param {string} title The title of the new playground.
   * @returns {Promise<number>} A promise that resolves to the ID of the newly created playground.
   */
  async createPlayground(title) {
    await this.init();
    const run = promisify(this.db.run.bind(this.db));
    const result = await run(
      'INSERT INTO playgrounds (title) VALUES (?)',
      [title]
    );
    return result.lastID; // Returns the ID of the last inserted row.
  }

  /**
   * Retrieves a single playground by its ID.
   * @param {number} id The ID of the playground to retrieve.
   * @returns {Promise<Object|undefined>} A promise that resolves to the playground object or undefined if not found.
   */
  async getPlayground(id) {
    await this.init();
    const get = promisify(this.db.get.bind(this.db));
    return await get(`
      SELECT id, title, created_at as createdAt, last_modified as lastModified 
      FROM playgrounds 
      WHERE id = ?
    `, [id]);
  }

  /**
   * Updates the title and last modified timestamp of an existing playground.
   * @param {number} id The ID of the playground to update.
   * @param {string} title The new title for the playground.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async updatePlayground(id, title) {
    await this.init();
    const run = promisify(this.db.run.bind(this.db));
    await run(
      'UPDATE playgrounds SET title = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?',
      [title, id]
    );
  }

  /**
   * Deletes a playground by its ID.
   * Due to ON DELETE CASCADE, related query history records will also be deleted.
   * @param {number} id The ID of the playground to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  async deletePlayground(id) {
    await this.init();
    const run = promisify(this.db.run.bind(this.db));
    await run('DELETE FROM playgrounds WHERE id = ?', [id]);
  }

  /**
   * Adds a query entry to the history table for a specific playground.
   * @param {number} playgroundId The ID of the playground where the query was executed.
   * @param {string} query The SQL query string.
   * @param {boolean} success True if the query executed successfully, false otherwise.
   * @param {string} [error=null] An optional error message if the query failed.
   * @returns {Promise<void>} A promise that resolves when the history record is added.
   */
  async addQueryHistory(playgroundId, query, success, error) {
    await this.init();
    const run = promisify(this.db.run.bind(this.db));
    await run(
      'INSERT INTO query_history (playground_id, query, success, error) VALUES (?, ?, ?, ?)',
      [playgroundId, query, success ? 1 : 0, error || null]
    );
  }

  /**
   * Retrieves the query history for a specific playground.
   * Limits the results to the 50 most recent queries.
   * @param {number} playgroundId The ID of the playground to retrieve history for.
   * @returns {Promise<Array>} A promise that resolves to an array of query history objects.
   */
  async getQueryHistory(playgroundId) {
    await this.init();
    const all = promisify(this.db.all.bind(this.db));
    return await all(`
      SELECT id, query, executed_at as executedAt, success, error
      FROM query_history 
      WHERE playground_id = ? 
      ORDER BY executed_at DESC 
      LIMIT 50
    `, [playgroundId]);
  }

  /**
   * Executes an arbitrary SQL query against the persistent database.
   * This is the core method for running user-provided SQL.
   * It handles both DDL (CREATE, INSERT) and DML (SELECT) operations.
   * @param {string} query The SQL query string to execute.
   * @returns {Promise<Object>} A promise that resolves to an object containing columns, rows, and rowCount.
   */
  async executeQuery(query) {
    await this.init(); // Ensure the main database is initialized.

    // Promisify the db.run and db.all methods for execution.
    // db.run is for DDL (CREATE, INSERT, UPDATE, DELETE) - it doesn't return data.
    // db.all is for DML (SELECT) - it returns all matching rows.
    const run = promisify(this.db.run.bind(this.db));
    const all = promisify(this.db.all.bind(this.db));

    try {
      // Determine if the query is a SELECT statement to choose the correct execution method.
      const isSelectQuery = query.toUpperCase().trim().startsWith('SELECT');

      let resultData;
      if (isSelectQuery) {
        // For SELECT queries, use db.all to fetch rows.
        resultData = await all(query);
      } else {
        // For non-SELECT queries (CREATE, INSERT, UPDATE, DELETE), use db.run.
        // db.run returns info about changes (like lastID, changes) but not selected rows.
        // We still need to return an empty array for rows and columns for consistency if no data is expected.
        await run(query);
        resultData = []; // No rows to return for DDL/DML without a SELECT clause.
      }
      
      // If no data was returned (e.g., from an INSERT or an empty SELECT),
      // ensure we return a consistent structure.
      if (!resultData || resultData.length === 0) {
        return { columns: [], rows: [], rowCount: 0 };
      }

      // Extract column names from the first row of the result set.
      const columns = Object.keys(resultData[0]);
      
      // Map the result rows to an array of arrays for easier rendering in a table.
      const rows = resultData.map(row => columns.map(col => row[col]));
      
      return {
        columns,
        rows,
        rowCount: resultData.length
      };
    } catch (err) {
      console.error('Error executing user query:', err);
      throw err; // Re-throw the error so the API route can handle it.
    }
  }

  /**
   * Closes the main database connection.
   */
  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Closed the database connection.');
      }
    });
  }
}

// Export a single instance of the Database class to maintain a consistent connection.
export const database = new Database();
