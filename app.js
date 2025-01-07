const clientId = '43b591551e6242169e1eb09919c034f2'; 
const clientSecret = '375ea26c73c64f889e17fb5cffee086b'; 

const favorites = new Set();
const playlists = {};

// Get Spotify Access Token
async function getAccessToken() {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const credentials = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// Search Tracks
async function searchTracks(query) {
  const token = await getAccessToken();
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;

  const response = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  displayTracks(data.tracks.items);
}

// Display Tracks
function displayTracks(tracks) {
  const trackList = document.getElementById('track_list');
  trackList.innerHTML = ''; // Clear previous results

  tracks.forEach(track => {
    const listItem = document.createElement('div');
    listItem.className = 'list-group-item';
    listItem.innerHTML = `
      <img src="${track.album.images[2].url}" alt="Album Cover" width="50" height="50">
      ${track.name} by ${track.artists[0].name}
    `;
    listItem.addEventListener('click', () => showTrackDetails(track));
    trackList.appendChild(listItem);
  });
}

// Show Track Details
function showTrackDetails(track) {
  const detailsDiv = document.getElementById('track_details');
  detailsDiv.innerHTML = `
    <h4>${track.name}</h4>
    <p>Artist: ${track.artists.map(artist => artist.name).join(', ')}</p>
    <img src="${track.album.images[1].url}" alt="Album Cover" width="150">
    <button class="btn btn-success mt-3" onclick="addToFavorites('${track.id}', '${track.name}')">Add to Favorites</button>
    <button class="btn btn-secondary mt-3" onclick="addToPlaylist('${track.id}', '${track.name}')">Add to Playlist</button>
  `;
}

// Add to Favorites
function addToFavorites(trackId, trackName) {
  if (favorites.has(trackId)) {
    alert('This track is already in Favorites!');
    return;
  }

  favorites.add(trackId);
  const favoritesDiv = document.getElementById('favorites');
  const listItem = document.createElement('div');
  listItem.className = 'list-group-item';
  listItem.textContent = trackName;
  favoritesDiv.appendChild(listItem);
}

// Add to Playlist
function addToPlaylist(trackId, trackName) {
  const playlistName = prompt('Enter playlist name:');
  if (!playlistName) return;

  if (!playlists[playlistName]) {
    playlists[playlistName] = new Set();
    const customPlaylistsDiv = document.getElementById('custom_playlists');
    const playlistDiv = document.createElement('div');
    playlistDiv.id = `playlist-${playlistName}`;
    playlistDiv.innerHTML = `<h5>${playlistName}</h5><ul class="list-group"></ul>`;
    customPlaylistsDiv.appendChild(playlistDiv);
  } else if (playlists[playlistName].has(trackId)) {
    alert('This track is already in this playlist!');
    return;
  }

  playlists[playlistName].add(trackId);
  const playlistUl = document.querySelector(`#playlist-${playlistName} ul`);
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item';
  listItem.textContent = trackName;
  playlistUl.appendChild(listItem);
}

// Event Listeners
document.getElementById('search_button').addEventListener('click', () => {
  const query = document.getElementById('search_input').value;
  if (query) searchTracks(query);
});
