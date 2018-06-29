const express = require('express'); 
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const Sequelize = require('Sequelize');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

//

//end the endless stuff 

const sequelize = new Sequelize('Music', 'David', null, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: '/Users/DavidScottPerez/Desktop/CODING!/SequelizeHandsOn/Chinook_Sqlite_AutoIncrementPKs.sqlite copy 2'
}); //end

//Artists and Albums models for mapping to database

const Artist = sequelize.define(
    'Artist',
    {
        ArtistId: {
            type: Sequelize.INTEGER,
            autoIncrement: true, 
            primaryKey: true
        },
        Name: Sequelize.STRING
    },
    {
        freezeTableName: true, 
        timestamps: false
    }
);

const Album = sequelize.define(
    'Album',
    {
        AlbumId: {
            type: Sequelize.INTEGER,
            autoIncrement: true, 
            primaryKey: true
        },
        Title: Sequelize.STRING
    },
    {
        freezeTableName: true, 
        timestamps: false
    }
);

const Track = sequelize.define(
    'Track',
    {
        TrackId: {
            type: Sequelize.INTEGER,
            autoIncrement: true, 
            primaryKey: true
    }, 
        Name: Sequelize.STRING
    },
    {
        freezeTableName: true, 
        timestamps: false
    }
);
//how to display all albums and artists in columns

Album.belongsTo(Artist, {foreignKey: 'ArtistId', targetKey: 'ArtistId'}); //this is kinda like inner join where you are combinding 2 col



    app.get('/albums', (req, res) => {

        Album.findAll({
            include: [{
                model: Artist
            }]
        }).then(Album => {
        
        res.render('albums', {Album});
           
        });
    });
    
    app.get('/add', (request, response) => {
        response.render('add');
    });
    app.get('/success', (request, response) => {
        response.render('success');
    });
//end display of artist and albums to handlebars


        //add artist 

        app.post('/success', (req, res) => {
        
        Artist.create({
            Name: req.body.name
        }).then(newArtist => {
            res.render('success');
            console.log(newArtist);
        });
            
        });

        //end form  


//search for song via song lenth


     app.get('/songsearch', (request, response) => {
        response.render('songsearch');
    });
    app.get('/songsearchresult', (request, response) => {
        response.render('songsearchresult');
    });
    app.get('/songsearchresult2', (request, response) => {
        response.render('songsearchresult2');
    });

    //song search 

      app.post('/songsearchresult', (req, res) => {
        const Op = Sequelize.Op //need this to breakdown the requirements kinda like WHERE
        //math math math
        const minutesValue = `${req.body.minutes}`;
        const secondsValue = `${req.body.seconds}`;
        const songLength = (minutesValue * 60000) + (secondsValue * 1000);


    //actual query -finds WHERE milliseconds < user inputted data LIMIT 1000
        Track.findAll({
            limit: 1000,
            where: {
                milliseconds: { [Op.lt]: songLength
            },
        }
        }).then(reqTrack => {

            res.render('songsearchresult', {reqTrack});
           // console.log(reqTrack);
    
        });
    });
    

// end song search
app.get("/", (request, response) => {
    // Album.findAll({
    //   include: [
    //     {
    //       model: Artist
    //     }
    //   ]
    // }).then(albumArtist => {
    //   response.render("albums", { responseData: albumArtist });
    // });
    const Op = Sequelize.Op;

    response.header({
      DBnumber: 01,
      Name: 'David'
    });
    if (request.header("music-request") === "album-artist") {
      Album.findAll({
        limit: 10,
        include: [

          {
            model: Artist
            }
          
        ]
      }).then(albumArtist => {
        response.json(albumArtist);
      });
    } else if (request.header("music-request") === "album") {
      Album.findAll().then(albums => {
        response.json(albums);
      });
    } else if (request.header("music-track-minutes", "music-track-seconds") === "song-length") {
        Track.findAll({
            limit:1000,
            where: {
                milliseconds: { [Op.gt]: 1000000
            }
        }
        }).then(tracks => {
            response.render('songsearchresult2', {tracks});
        });
    } else if (request.header("save-for-reference") === true) {
      response.render("albums", { responseData: albumArtist });
s
    } else {
      response.send(404, "The specified table name does not exist. Sorry!");
    }
  });



                                
           app.use((req, res) => {
            res.status(404);
            res.render('404');
        });
      
        //begin listener
        app.listen(app.get('port'), () => {
            console.log(
                '>>>> Server Start. . . . . . Successful >>>> begin now >>>>'
            );
        });
