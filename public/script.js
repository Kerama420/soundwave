const axios = require('axios');

// Define the Spotify API URL
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';

// Fetch access token using your Client ID and Client Secret
async function getSpotifyAccessToken() {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const clientID = '43b591551e6242169e1eb09919c034f2'; // Replace with your Spotify Client ID
  const clientSecret = '375ea26c73c64f889e17fb5cffee086b'; // Replace with your Spotify Client Secret
  const authHeader = 'Basic ' + Buffer.from(clientID + ':' + clientSecret).toString('base64');

  try {
    const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
}

// Example function to get the top tracks
async function getTopTracks() {
  const token = await getSpotifyAccessToken();
  
  if (token) {
    const tracksUrl = `${SPOTIFY_API_URL}me/top/artists`;
    const response = await axios.get(tracksUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);
  }
}

getTopTracks();
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    searchSpotify(query);
  });
  