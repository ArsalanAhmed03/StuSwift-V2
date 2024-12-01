async function fetchTrackDetails({ trackId, token }) {
    console.log("Fetching details for Track ID:", trackId);

    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Error fetching track details:", response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const trackData = await response.json();
        console.log("Fetched Track Details:", trackData);

        // Extract album images
        const albumImages = trackData.album.images; // This contains an array of image URLs
        return albumImages;

    } catch (error) {
        console.error("Failed to fetch track details:", error.message);
        throw error;
    }
}

export default fetchTrackDetails;
