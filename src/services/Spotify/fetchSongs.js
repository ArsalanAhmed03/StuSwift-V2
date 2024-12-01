async function fetchSongs(token){
const req = await fetch('https://api.spotify.com/v1/me/tracks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


const result = await req.json()

console.log(result)
return result
}


export default fetchSongs;