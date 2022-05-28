const dotenv = require("dotenv")
const { ethers } = require("ethers")
const Moralis = require("moralis/node")
const { insertStakeLog, getStakeLog } = require("./database")
const abiCoder = new (require("ethers").utils.AbiCoder)()
dotenv.config()

let last_block = 13443143
let is_pending = false
let provider = new ethers.providers.JsonRpcProvider(
  "https://speedy-nodes-nyc.moralis.io/0b0d5832f16454cef1bc3764/avalanche/mainnet"
)

const updateStakeEventLogs = async () => {
  const options = {
    address: "0x1d647379e4006768ab1b2b19495594ebe3fa4f9d",
    chain: "avalanche",
    topic0:
      "0x5af417134f72a9d41143ace85b0a26dce6f550f894f2cbc1eeee8810603d91b6",
    from_block: last_block,
  }
  if (is_pending) return
  is_pending = true

  console.log("getting logs...")
  const logs = (await Moralis.Web3API.native.getLogsByAddress(options)).result
  let count = 1
  for (let log of logs) {
    if (log.data) {
      let stakeInfo = decodeLogData(log)
      const stake_logs_from_database = await getStakeLog(stakeInfo.address)
      stakeInfo.deposit_id = stake_logs_from_database.rows.length
      console.log(`inserting number ${count++} data`)
      await insertStakeLog(stakeInfo)
    }
  }
  console.log(`successfully inserted ${count} rows`)
  last_block = await provider.getBlockNumber()
  console.log(`last_block is updated to ${last_block}`)
  is_pending = false
}
const decodeLogData = (log) => {
  const res = abiCoder.decode(["address", "uint256", "uint256"], log.data)
  console.log(res)
  return {
    address: res[0],
    amount: parseFloat(ethers.utils.formatEther(res[1])),
    lock_start: new Date(log.block_timestamp).getTime()/1000,
    lock_until: res[2].toNumber(),
  }
}

const main = async () => {
  console.clear()
  await Moralis.start({
    serverUrl: process.server_url,
    appId: process.env.app_id,
    moralisSecret: process.env.moralis_secret,
  })
  // setInterval(updateStakeEventLogs, 10000)
  // updateStakeEventLogs()
  console.log(await getStakeLog('0x5181E7418b1BeDfc176703741E1b8A887E65a525'))
}

main().catch((err) => console.error(err))
