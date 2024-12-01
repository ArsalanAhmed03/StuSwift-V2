async function fetchPlaylists(token, userURI){


    const userID = userURI ? userURI.split(":").pop() : null;

    if (!userID) {
        throw new Error("Invalid userURI: userURI is undefined or does not contain a valid Spotify URI.");
    }
    
    console.log("User's ID is: ", userID);

    const req = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
    
    
    const result = await req.json()
    
    console.log(result)
    return result
}

export default fetchPlaylists;