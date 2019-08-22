# best-flight-fares

This repo follow implemented by this article : [หาตั๋วเครื่องบินราคาถูกล่วงหน้าด้วย Javascript และ Puppeteer](https://peerasak.com/post/how-to-get-best-flight-fares-with-js)

1. npm i

2. touch .env to create .env file to setup env

   ```js
   PORT = 3000;
   YELLOW_AIRLINE = "YellowAir";
   RED_AIRLINE = "RedAir";
   YELLOW_AIRLINE_URL = "https://www.yellowair.com/Flight/GetCalendarFare";
   RED_AIRLINE_URL = "https://www.redair.com/th/th";
   ```

3. npm start

4. use postman

   - GET : /v1/{yellowairline|redairline}: to get yellow air line or redairline fares with those query params

     - from = departure
     - to = destination
     - fromDate = MM/DD/YYY
     - toDate = MM/DD/YYY
     - currency
     - expectPrice

   - example

     ```
     /v1/yellowairline?from=DMK&to=NRT&fromDate=08/1/2019&toDate=08/31/2019&currency=THB&expectPrice=7000
     ```
