const sql = require("mssql");

function recHit(database, consultaSQL): Promise<any> {
    const config = {
        user: 'sa',
        password: 'LOperas93786',
        server: 'silema.hiterp.com',
        database: database,
    };

    const devolver = new Promise((dev, rej) => {
        new sql.ConnectionPool(config).connect().then((pool) => {
            return pool.request().query(consultaSQL);
        }).then(result => {
            dev(result);
            sql.close();
        }).catch(err => {
            console.log(err);
            console.log("SQL: ", consultaSQL)
            sql.close();
        });
    });
    return devolver;
}
export { recHit };
