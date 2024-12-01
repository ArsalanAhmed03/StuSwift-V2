async function fetchAlbumTracks({ albumId, token }) {
    console.log("Token Received in FetchAlbumTracks: ", token);

    try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Check if the response is okay
        if (!response.ok) {
            console.error("Error fetching album tracks:", response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Fetched Album Tracks:", result);
        return result;

    } catch (error) {
        console.error("Fetch failed:", error.message);
        throw error; // Re-throw the error to handle it in the calling function if needed
    }
}

export default fetchAlbumTracks;
