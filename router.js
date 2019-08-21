import Router from 'koa-router'
import yellowAirline from './controllers/yellow-air-line.controller'
import redAirline from './controllers/red-air-line.controller'

const router = new Router({ prefix: '/v1' })

router.get('/yellowairline', yellowAirline)
router.get('/redairline', redAirline)

export default router