import dayjs from 'dayjs'
import config from '../config'
import puppeteer from 'puppeteer'

const getRedAirLinePage = async (browser, from, to) => {
	const page = await browser.newPage()
	const mainUrl = config.redAirlineUrl
	const departSelector = 'input[aria-controls="home-origin-autocomplete-heatmapstation-combobox"]'

	await page.goto(mainUrl)
	await page.waitForSelector(departSelector)
	await page.click(departSelector)
	await page.waitFor(200)
	await page.keyboard.type(from)
	await page.keyboard.press('Enter')
	await page.waitFor(200)
	await page.keyboard.type(to)
	await page.keyboard.press('Enter')
	return page
}

const getFlights = async ctx => {
	return new Promise(async (resolve, rejects) => {
		try {
			const { from, to, currency } = ctx.request.query
			const fromDate = dayjs(ctx.request.query.fromDate)
			const toDate = dayjs(ctx.request.query.toDate)
			const todayDate = dayjs().format('YYYY-MM-DD')
			const airline = config.redAirline

			const browser = await puppeteer.launch({ headless: true })
			const page = await getRedAirLinePage(browser, from, to)
			page.on('response', async res => {
				if (res.url() === `https://k.airasia.com/availabledates-pwa/api/v1/pricecalendar/0/1/${currency}/${from}/${to}/${todayDate}/1/16`) {
					try {
						const data = await res.json()
						const dataKey = `${from}${to}|${currency}`
						const filtered = Object.keys(data[dataKey]).filter(value => {
							const keyDate = dayjs(value, 'YYYY-MM-DD')
							return keyDate.isAfter(fromDate, 'YYYY-MM-DD') && keyDate.isBefore(toDate, 'YYYY-MM-DD')
						})
						const results = filtered.map(key => {
							const keyDate = dayjs(key, 'YYYY-MM-DD')
							const date = keyDate.format('DD/MM/YYYY')
							const day = keyDate.format('ddd')
							const fare = data[dataKey][key]
							return {
								from,
								to,
								date,
								day,
								fare,
								currency,
								airline
							}
						})
						console.log(results)
						resolve(results)
					} catch (err) {
						throw err
					}
					browser.close()
				}
			})
		} catch (err) {
			console.log(`error : ${err}`)
			rejects(err)
		}
	})
}

const getExpectFares = async ctx => {
	try {
		const { expectPrice } = ctx.query
		const results = await getFlights(ctx)
		if (results.length <= 0) {
			return ctx.body = {
				status: 200,
				message: 'Not found any flights'
			}
		}

		const filtered = results.filter(item => {
			return item.fare <= expectPrice
		})

		return ctx.body = {
			status: 200,
			flights: filtered
		}
	} catch (e) {
		console.log(`error : ${e}`)
		return ctx.body = {
			status: 500,
			message: `Error : Unexpect error : ${e}`
		}
	}
}

export default getExpectFares

