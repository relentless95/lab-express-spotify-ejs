require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/artist-search", (req, res) => {
  console.log(req.query);
  const artistSearch = req.query.artist;
  spotifyApi
    .searchArtists(artistSearch)
    .then((data) => {
      // console.log('The received data from the API: ', data.body)
      // console.log('databody items: ', data.body.artists.items)
      const dataBody = data.body.artists.items;
      // console.log(data.body.artists.items[0]);

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { dataBody });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// app.get("/artist-search-results", (req, res) => {
//   res.render("artist-search-results");
// });

app.get('/albums/:artistId', async (req, res) => {
  // .getArtistAlbums() code goes here
  try{
   const albums = await spotifyApi
    .getArtistAlbums(req.params.artistId)
    const albumArr = albums.body.items
    const artistName = albumArr[0].artists[0].name
    console.log(albumArr[0].artists[0].name)
    res.render('albums', {albumArr, artistName} )
  }catch(error) {
    console.log(error)
  }
})

app.get('/tracks/:albumId', async (req, res) => {
  // .getArtistAlbums() code goes here
  try{
   const tracks = await spotifyApi
    .getAlbumTracks(req.params.albumId)
    const tracksArr = tracks.body.items
    console.log(`this are all the tracks` ,tracksArr)
    res.render('tracks', {tracksArr} )
  }catch(error) {
    console.log(`we have an error in the albums `,error)
  }
})

app.listen(process.env.PORT, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
