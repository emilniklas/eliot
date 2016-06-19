import 'isomorphic-fetch/fetch-npm-node'

global.__fetch = global.fetch

const devMode = process.env.NODE_ENV === 'development'
const productionMode = !devMode
process.env.ELIOT_DEV_MODE = devMode ? 'true' : 'false'
process.env.ELIOT_PRODUCTION_MODE = productionMode ? 'true' : 'false'
process.env.ELIOT_TARGET = 'node6'
process.env.ELIOT_SERVER = true
process.env.ELIOT_BROWSER = false
