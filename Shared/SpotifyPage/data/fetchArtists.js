
async function fetchArtists(token){

    const req = await fetch('https://api.spotify.com/v1/me/following?type=artist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
    
    const result = await req.json()
    
    console.log(result)
    return result
}

export default fetchArtists;