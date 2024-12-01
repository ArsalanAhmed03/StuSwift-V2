async function fetchArtistsTracks(artistId, token) {
    console.log("Token Received in FetchAlbumTracks: ", token);
  
    try {
      const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        console.error("Error fetching artist tracks:", response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Fetched Artist Tracks:", result.tracks);
      return result.tracks; // Return the tracks array
    } catch (error) {
      console.error("Fetch failed:", error.message);
      throw error;
    }
  }
  
  export default fetchArtistsTracks;
  