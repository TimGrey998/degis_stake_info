const { Client } = require("pg")
const dotenv = require('dotenv')
dotenv.config('.env')

const create_stake_logs = `CREATE TABLE degis_stake_logs(
    address VARCHAR(42) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    lock_start INT NOT NULL,
    lock_until INT NOT NULL,
    deposit_id INT NOT NULL
);`

const create_last_block_number = `CREATE TABLE update_config(
  start_block INT NOT NULL,
  last_block INT NOT NULL,
  update_time INT NOT NULL
)
`

const client = new Client({
  user: "yifan",
  host: process.env.database_host,
  database: "deg_staking_detail",
  password: process.env.database_psw,
  port: process.env.database_port,
})
client.connect()

const insertStakeLog = async (stakeInfo) => {
  const sql_text = `INSERT INTO degis_stake_logs values ('${stakeInfo.address}',
    ${stakeInfo.amount},
    ${stakeInfo.lock_start},
    ${stakeInfo.lock_until},
    ${stakeInfo.deposit_id}
  );`
  await sql_query(sql_text)
}

const getStakeLog = async (address) => {
  const sql_text = `SELECT * FROM degis_stake_logs where ADDRESS = '${address}';`
  return await sql_query(sql_text)
}

const getLastBlock = async (block_number) => {
  const sql_text = ``
  return await sql_query(sql_text)
}

const setLastBlock = async (block_nubmer) => {
  const sql_text = ``
  return await sql_query(sql_text)
}

const sql_query = (sql_text) => {
  console.log(sql_text)
  return new Promise((resolve, reject) => {
    client.query(sql_text, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

module.exports = {
  insertStakeLog,
  getStakeLog,
}
