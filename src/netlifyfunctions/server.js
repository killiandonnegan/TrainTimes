const express = require('express');
const axios = require('axios');
const app = express();
const serverless = require('serverless-http');
const cors = require('cors');

app.use(cors());

app.get('/.netlify/functions/server', async (req, res) => {
  try {
    // Extract query parameters from the request URL
    const { StationCode } = req.query;

    // Build the IrishRail API URL with the provided parameters
    const apiUrl = `http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByCodeXML_WithNumMins?StationCode=${StationCode}&NumMins=60&format=xml`;
    // Make a request to the IrishRail API
    const response = await axios.get(apiUrl, {
      // Add any necessary headers or query parameters here
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch data' });
  }
});

// Export the Express app for use with serverless-http
module.exports.handler = serverless(app);
