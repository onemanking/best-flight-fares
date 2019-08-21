
import 'dotenv/config'

const config = {
	port: process.env.PORT,
	yellowAirlineUrl: process.env.YELLOW_AIRLINE_URL,
	redAirlineUrl: process.env.RED_AIRLINE_URL,
	yellowAirline: process.env.YELLOW_AIRLINE,
	redAirline: process.env.RED_AIRLINE,
}

export default config