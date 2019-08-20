import config from './config'
import bodyParser from 'koa-bodyparser'
import Koa from 'koa'
import router from './router'

const app = new Koa()

app.use(bodyParser())
app.use(router.routes())

app.listen(config.port, () => {
	console.log(`APP LISTENING ON http://localhost:${config.port}`)
})