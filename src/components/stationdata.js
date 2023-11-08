import React, { useState, useEffect } from 'react';
import parser from 'xml2js';
import '../App.css'; // Relative path to App.css from YourComponent.js

function StationData({ stationCode }) {
  const [trainData, setTrainData] = useState(null);
  const [stationName, setStationName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://dashing-selkie-57eede.netlify.app/.netlify/functions/server?StationCode=${stationCode}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const xmlText = await response.text();
        console.log(xmlText);

        // Replace escaped characters
        const decodedXmlText = xmlText
          .replace(/\\"/g, '"') // Replace escaped double quotes
          .replace(/\\r\\n/g, '\r\n'); // Replace escaped newline characters

        // Remove the first and last double quotes
        const cleanedXmlText = decodedXmlText.slice(1, -1);

        // Parse the cleaned XML data
        parser.parseString(cleanedXmlText, (err, result) => {
          if (err) {
            console.error('Error parsing XML data', err);
          } else {
            setTrainData(result.ArrayOfObjStationData.objStationData);
            if (result.ArrayOfObjStationData.objStationData.length > 0) {
              // Set the station name using the first item in the array (assuming all have the same station name)
              setStationName(result.ArrayOfObjStationData.objStationData[0].Stationfullname[0]);
            }
          }
        });
      } catch (error) {
        console.error('Error fetching or parsing XML data', error);
      }
    };

    fetchData();
  }, [stationCode]);

  return (
    <div>
      {stationName && <h1>{stationName}</h1>}
      {trainData && (
        <div className="train-list">
          {trainData.map((train, index) => (
            <div key={index} className="train-item">
              <p>
                <span className="label">Origin:</span>{train.Origin[0]},{' '}
                <span className="label">Destination:</span>{train.Destination[0]},{' '}
                <span className="label">Departed:</span>{train.Origintime[0]},{' '}
                <span className="label">Expected:</span>{train.Exparrival[0]},{' '}
                <span className="label">Last Location:</span>{' '}{train.Lastlocation[0] || 'No data'}, {/* fallback for no data */}
              </p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StationData;
