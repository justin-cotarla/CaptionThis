import mysql from 'mysql';

class DatabaseUtil {
    constructor() {
        this.init();
    }

    init() {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: process.env.DB_ENDPOINT,
            user: process.env.DB_USER,
            password: process.env.DB_KEY,
            database: 'captionthis_db',
        });
    }

    getConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(connection);
            });
        });
    }

    sendQuery(queryString, values) {
        const query = mysql.format(queryString, values);
        return this.getConnection()
            .then(connection => new Promise((resolve, reject) => {
                connection.query(query, (err, rows, fields) => {
                    connection.release();
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({
                        rows,
                        fields,
                    });
                });
            }));
    }

    end() {
        this.pool.end();
    }
}

export default new DatabaseUtil();
