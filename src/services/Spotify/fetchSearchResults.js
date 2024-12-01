export const fetchSearchResults = async (searchString, token) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchString}&type=track`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.tracks.items;
    } catch (error) {
      throw new Error("Failed to fetch search results");
    }
  };
  