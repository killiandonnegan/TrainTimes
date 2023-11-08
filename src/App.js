import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db, auth } from './config/firebase';
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import StationData from './components/stationdata';

function App() {
  const [stations, setStations] = useState([]);
  const [newStation, setNewStation] = useState('');
  const [updatedStation, setUpdatedStation] = useState(''); // New state to hold updated station ID
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

    // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  // Define a list of possible station codes
  const possibleStationCodes = [
    'Maynooth - MYNTH',
    'Malahide - MHIDE',
    'Code3',
    // Add more station codes here
  ];

  const getStations = async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setStations(userData.stations || []);
        } else {
          setStations([]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onAddStation = async () => {
    try {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { stations: arrayUnion(newStation) });
        setNewStation('');
        getStations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStation = async (stationName) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        stations: stations.filter((station) => station !== stationName),
      });
      getStations();
    }
  };

  const updateStation = async (stationName) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const stationIndex = stations.indexOf(stationName);
      if (stationIndex !== -1) {
        const updatedStations = [...stations];
        updatedStations[stationIndex] = updatedStation;
        await updateDoc(userDocRef, { stations: updatedStations });
        setUpdatedStation('');
        getStations();
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false after authentication state is determined
    });

    if (user) {
      // If the user is already authenticated, get the list of stations
      getStations();
    }

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <div className="content-container">
        {user ? (
          <div>
            <div className="main-content">
              <div className="dark-mode-button-container">
                <button onClick={toggleDarkMode} className="dark-mode-button">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
              <div className="stations-list">
                <div className="signout-button-container">
                  Signed in as {user.displayName}, {user.email}
                  <button onClick={handleSignOut} className="signout-button">
                    Sign Out
                  </button>
                </div>
                <div className='link-container'>
                  <a target="_blank" href='https://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML'>View all station codes</a>
                </div>
                <input
                  placeholder="Station code... eg. MYNTH"
                  value={newStation}
                  onChange={(e) => setNewStation(e.target.value)}
                ></input>
                <button onClick={onAddStation}>Add Station</button>
  
                {stations.map((station, index) => (
                  <div key={index} className='station'>
                    <h2>StationID: {station}</h2>
                    <StationData stationCode={station} />
                    <div className='remove-button-container'>
                      <button onClick={() => deleteStation(station)}>Remove Station</button>
                    </div>
                    <div>
                      <input
                        placeholder="Update station ID"
                        value={updatedStation}
                        onChange={(e) => setUpdatedStation(e.target.value)}
                      ></input>
                      <button onClick={() => updateStation(station)}>Update ID</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Auth />
        )}
      </div>
    </div>
  );
  
}

export default App;
