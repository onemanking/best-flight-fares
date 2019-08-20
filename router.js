import Router from 'koa-router'
import nokair from './controllers/nokair.controller'

const router = new Router({ prefix: '/v1' })

router.get('/nokair', nokair)

export default router