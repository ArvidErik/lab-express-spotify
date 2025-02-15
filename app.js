require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  const query = req.query.search;

  spotifyApi
    .searchArtists(query)
    .then(function (data) {
      console.log(`Search artists by ${query}`, data.body.artists);
      const artists = data.body.artists;
      console.log(artists.items[0]);
      res.render("artistSearchResults", { artists });
    })
    .catch(function (err) {
      console.error(err);
    });
});

app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(function (data) {
      console.log("Artist albums", data.body);
      const albums = data.body.items;
      console.log(albums);
      res.render("albums", { albums });
    })
    .catch(function (err) {
      console.error(err);
    });
});

app.get("/tracks/:id", (req, res)=>{
    spotifyApi.getAlbumTracks(req.params.id, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body);
    const tracks = data.body.items
    res.render("tracks", {tracks})
  })
  .catch(function(err) {
    console.log('Something went wrong!', err);
  });
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
