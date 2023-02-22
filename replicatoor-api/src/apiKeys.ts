import {Client} from 'pg';

const client = new Client({
    user: 'apiv2readonly',
    password: 'AVNS_ZgCJpZnzf7T7hlYAYmX',
    host: 'module-v2-do-user-8592364-0.b.db.ondigitalocean.com',
    port: 25061,
    database: 'readonly-pool',
    ssl: {
      rejectUnauthorized: false
    },
})

client.connect()


export let apiKeys = [];
const getApiKeys = async () => {
    const res = await client.query('SELECT * FROM mhz_api_keys')
    console.log(res.rows)
    apiKeys = res.rows.map((row) => {
        return row.apikey   
    })
    // console.log(apiKeys)
}




getApiKeys()

setInterval(() => {
    getApiKeys()
}, 60000)