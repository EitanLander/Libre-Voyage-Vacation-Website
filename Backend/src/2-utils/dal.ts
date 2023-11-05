import mysql from "mysql";
import appConfig from "./app-config";

// Creating connection to the database:
const connection = mysql.createPool({
  host: appConfig.host,
  user: appConfig.user,
  password: appConfig.password,
  database: appConfig.database,
});

// Execute any sql:
function execute(sql: string, values?: any[]): Promise<any> {
  // Promisify:
  return new Promise<any>((resolve, reject) => {
    // Execute query in database:
    connection.query(sql, values, (err, result) => {
      // If query failed:
      if (err) {
        reject(err);
        return;
      }

      // Query succeeded:
      resolve(result);
    });
  });
}

export default {
  execute,
};
