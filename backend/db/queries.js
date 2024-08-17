const pool = require('./pool');

async function getallitems(){
    const { items } = await pool.query("SELECT * FROM items");
}


module.exports = {
    getallitems
}