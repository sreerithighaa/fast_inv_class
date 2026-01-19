const {Pool}=require('pg');

const pool=new Pool({
    user:'postgres',
    host:'localhost',
    database:'fastinv_class',
    password:'trogen',
    port:5432,
})

module.exports=pool;