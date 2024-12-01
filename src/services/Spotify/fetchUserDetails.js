async function fetchUserDetails(token){

    const req = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
    
    const result = await req.json()
    
    console.log(result)
    return result
}

export default fetchUserDetails;