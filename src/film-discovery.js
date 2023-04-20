const fs = require('fs');


function createFilmList(path2) {
    //convert path2 to real path
    //let realpathtoFix = fs.realpath(path2)
    console.log("Path: " + path)
    let filmList = [];
    //get all folders in the path
    let folders = fs.readdirSync(path);
    for (let i = 0; i < folders.length; i++) {
        let film = {};
        film.foldername = folders[i];
        film.path = path + folders[i];

        let files = fs.readdirSync(path + folders[i]);

        files.forEach(file => {
            if (file.endsWith('.mp4') || file.endsWith('.mkv')) {
                //console.log("Film video file found: " + file)
                film.file=file;
            }
            else if (file.endsWith('.srt') ) {
                //console.log("Film subtitle file found: " + file)
                film.subtitle=file;
            }
            else if (file.endsWith('.nfo') ) {
                //console.log("Film nfo file found: " + file)
                let meta = {};
                meta.nfo=file;
                let nfo = fs.readFileSync(film.path + "/" + file, 'utf8');
                film.title = nfo.match(/<title>(.*?)<\/title>/)[1];
                meta.year = nfo.match(/<year>(.*?)<\/year>/)[1];
                meta.plot = nfo.match(/<plot>(.*?)<\/plot>/)[1];
                meta.tagline = nfo.match(/<tagline>(.*?)<\/tagline>/)[1];
                meta.rating = nfo.match(/<rating>(.*?)<\/rating>/)[1];
                meta.runtime = nfo.match(/<runtime>(.*?)<\/runtime>/)[1];
                meta.genre = nfo.match(/<genre>(.*?)<\/genre>/)[1];
                meta.director = nfo.match(/<director>(.*?)<\/director>/)[1];

                meta.actors = nfo.match(/<name>(.*?)<\/name>/g).map(actor => {
                    const matches = actor.match(/<name>(.*?)<\/name>/g);
                    if (matches && matches.length > 0) {
                        return matches[0].replace('<name>', '').replace('</name>', '');
                    } else {
                        return '';
                    }
                }).toString();

                meta.bitrate = nfo.match(/<bitrate>(.*?)<\/bitrate>/)[1];
                meta.framerate = nfo.match(/<framerate>(.*?)<\/framerate>/)[1];
                meta.codec = nfo.match(/<video>([\s\S]*?)<codec>(.*?)<\/codec>/)[2];
                meta.aspectratio = nfo.match(/<aspectratio>(.*?)<\/aspectratio>/)[1];

                film.metadata = meta;
            }
        });



        filmList.push(film);
    }
    return filmList;
}

let path = "/home/adelpozoman/films/"

//filmListasdf = createFilmList(path)

//console.log(filmListasdf)

module.exports = createFilmList;