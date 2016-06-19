import 'source-map-support/register'
import 'isomorphic-fetch/fetch-npm-node'

global.__fetch = global.fetch

const devMode = process.env.NODE_ENV !== 'production'
const productionMode = !devMode
process.env.ELIOT_DEV_MODE = devMode
process.env.ELIOT_PRODUCTION_MODE = productionMode
process.env.ELIOT_TARGET = 'node6'
process.env.ELIOT_SERVER = true
process.env.ELIOT_BROWSER = false
