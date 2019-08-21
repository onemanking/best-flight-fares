import axios from 'axios'
import dayjs from 'dayjs'
import config from '../config'

const getFlights = async ctx => {
	return new Promise(async (resolve, rejects) => {
		try {
			const { from, to, currency } = ctx.request.query
			const fromDate = dayjs(ctx.request.query.fromDate).format('MM/DD/YYYY')
			const toDate = dayjs(ctx.request.query.toDate).format('MM/DD/YYYY')
			const mainUrl = config.yellowAirlineUrl
			const url = `${mainUrl}?from=${from}&to=${to}&fromDate=${fromDate}&toDate=${toDate}&currency=${currency}`
			const airline = config.yellowAirline

			const res = await axios.get(url)
			const results = res.data.map(item => {
				const itemDate = dayjs(item.dateKey, 'YYYYMMDD')
				return {
					from,
					to,
					date: itemDate.format('DD/MM/YYYY'),
					day: itemDate.format('ddd'),
					fare: parseFloat(item.amount.replace(',', '')),
					currency,
					airline
				}
			})
			console.log(results)
			resolve(results)
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
	} catch (err) {
		console.log(`error : ${err}`)
		return ctx.body = {
			status: 500,
			message: `Error : Unexpect error : ${err}`
		}
	}
}

export default getExpectFares