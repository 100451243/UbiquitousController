const arrayOfnames = ['Alien (1979)',
    'Alien³ (1992)',
    'Alien.Covenant.2017.1080p.WEB-DL.H264.AC3-EVO[EtHD]',
    'Alien Resurrection (1997)',
    'Aliens (1986)',
    'Aliens vs Predator Requiem (2007)',
    'Arrival (2016)',
    'Avatar (2009)',
    'AVP Alien vs. Predator (2004)',
    'Batman Begins (2005)',
    'Battleship (2012)',
    'Blade Runner (1982)',
    'Blade Runner 2049 (2017)',
    'Borat (2006) [1080p]',
    'Borat Subsequent Moviefilm (2020) [1080p] [WEBRip] [5.1] [YTS.MX]',
    'Captain.Marvel.2019.1080p.WEB-DL.DD5.1.H264-FGT',
    'Catch Me If You Can (2002)',
    'District 9 (2009)',
    'Doctor Strange (2016)',
    'Dont Look Up (2021)',
    'Dune (2021)',
    'Dunkirk (2017)',
    'Elysium (2013)',
    'Fight Club (1999)',
    'Game Night 2018 1080p WEB-HD 1.3 GB - iExTV',
    'Gattaca (1997)',
    'Inception (2010)',
    'Interstellar (2014)',
    'In Time (2011)',
    'Invictus',
    'John Wick (2014)',
    'John Wick Chapter 2 (2017)',
    'John Wick Chapter 3 - Parabellum (2019)',
    'Joker (2019)',
    'Kingsman The Golden Circle (2017)',
    'Kingsman The Secret Service (2015)',
    'Looper (2012)',
    'Mad Max Fury Road (2015)',
    'Matrix',
    'Mortal Engines (2018)',
    'Now You See Me (2013)',
    'Now You See Me 2 (2016)',
    'Oblivion (2013)',
    'Once Upon A Time ... In Hollywood (2019) [BluRay] [1080p] [YTS.LT]',
    'Parasites',
    'Pitch Black (2000)',
    'Pulp.Fiction.1994.1080p.BluRay.H264.AAC-RARBG',
    'Ready Player One (2018)',
    'Riddick (2013)',
    'Rogue One',
    'Shutter Island (2010)',
    'Solo A Star Wars Story (2018) [BluRay] [1080p] [YTS.AM]',
    'Star Trek Into Darkness (2013) [1080p]',
    'Star Wars Episode II - Attack of the Clones (2002)',
    'Star Wars Episode III - Revenge of the Sith (2005)',
    'Star Wars Episode I - The Phantom Menace (1999)',
    'Star.Wars.Episode.VII.The.Force.Awakens.2015.1080p.BluRay.x264.DTS-JYK',
    'Star Wars The Last Jedi (2017) [BluRay] [1080p] [YTS.AM]',
    'Star Wars The Rise of Skywalker (2019)',
    'Tenet (2020) [1080p] [BluRay] [5.1] [YTS.MX]',
    'The Big Reset',
    'The Big Short',
    'The Chronicles of Riddick (2004)',
    'The Collector',
    'The Dark Knight (2008)',
    'The Dark Knight Rises (2012)',
    'The Godfather (1972)',
    'The Godfather Part II (1974)',
    'The Godfather Part III (1990)',
    'The Hangover (2009)',
    'The Hangover Part II (2011)',
    'The Hangover Part III (2013)',
    'The Iron Giant (1999)',
    'The Kings Man (2021)',
    'The.Martian.2015.EXTENDED.1080p.BRRip.x264.AAC-ETRG',
    'The.Prestige.2006.1080p.BluRay.x264.anoXmous',
    'The.Social.Dilemma.2020.720p.NF.WEBRip.800MB.x264-GalaxyRG[TGx]',
    'The Wolf of Wall Street (2013)',
    'Transformers',
    'Treasure Planet (2002)',
    'TRON Legacy (2010)',
    'V for Vendetta (2006)',
];

//document.getElementById("display").innerHTML = arrayOfnames.join("<br>");

main = document.getElementById("display");

main.innerHTML += `<div class="card-columns"></div>`
for (let j = 0; j < arrayOfnames.length; j++) {
    main.innerHTML += `

    <div class="col">


            <div class="card" style="max-width: 30%">
            <img class="card-img-top" src="..." alt="Card image cap">
            <div class="card-body">
            <h5 class="card-title">`+ arrayOfnames[j] + `</h5>
            <p class="card-text">  Esta película está guapa
                </p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
            </div>
    </div>
`
}
main.innerHTML += `</div>`
//<p id="display" style="width:1000px;height:1000px"></textarea>
//style="width: 18rem;"
