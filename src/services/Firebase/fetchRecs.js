async function fetchRecs(token){

    const req = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
    
    const result = await req.json()
    
    console.log(result)
    return result
}


export default fetchRecs