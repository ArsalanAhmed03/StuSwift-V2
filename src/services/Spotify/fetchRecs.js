async function fetchRecs(token) {
  try {
      console.log("Token used for request:", token);

      const url = 'https://api.spotify.com/v1/browse/new-releases';
      const req = await fetch(url, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      if (!req.ok) {
          throw new Error(`HTTP Error: ${req.status} - ${req.statusText}`);
      }

      const result = await req.json();
      console.log("Featured playlists response:", result);
      return result;
  } catch (error) {
      console.error("Error fetching featured playlists:", error.message);
      return null;
  }
}

export default fetchRecs;
