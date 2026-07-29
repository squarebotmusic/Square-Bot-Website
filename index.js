



// ==========================================================
// VARIABLES
// ==========================================================


const desktopIcons = document.querySelectorAll(".desktop-icon");

const windows = document.querySelectorAll(".window");

const startButton = document.getElementById("start-button");

const startMenu = document.getElementById("start-menu");

const taskbarPrograms = document.getElementById("taskbar-programs");

const clock = document.getElementById("clock");



let highestZ = 20;



// ==========================================================
// OPEN WINDOW FUNCTION
// ==========================================================


function openWindow(windowID){


    const windowElement = document.getElementById(windowID);


    if(!windowElement) return;

     

    // show window

    windowElement.classList.remove("hidden");



    // bring to front

    focusWindow(windowElement);

     

    // create taskbar button

    createTaskbarButton(windowElement);



}





// ==========================================================
// CLOSE WINDOW FUNCTION
// ==========================================================


function closeWindow(windowElement){


    windowElement.classList.add("hidden");



    removeTaskbarButton(windowElement.id);



}





// ==========================================================
// WINDOW FOCUS
// ==========================================================


function focusWindow(windowElement){


    highestZ++;


    windowElement.style.zIndex = highestZ;



    windows.forEach(win => {


        win.classList.remove("active");


    });



    windowElement.classList.add("active");


}





// ==========================================================
// DESKTOP ICON EVENTS
// ==========================================================


desktopIcons.forEach(icon => {



    icon.addEventListener("click", () => {



        const targetWindow = icon.dataset.window;



        openWindow(targetWindow);



    });



});



// ==========================================================
// DESKTOP ICON CLICK EVENTS
// ==========================================================

document.querySelectorAll(".desktop-icon").forEach(icon => {


    icon.addEventListener("click", () => {


        const windowID = icon.dataset.window;


        openWindow(windowID);


    });


});





// ==========================================================
// START MENU ITEMS
// ==========================================================


const startItems = document.querySelectorAll(

    "#start-menu li"

);



startItems.forEach(item => {



    item.addEventListener("click", () => {



        const target = item.dataset.window;



        openWindow(target);



        startMenu.classList.add("hidden");



    });



});





// ==========================================================
// CLOSE BUTTONS
// ==========================================================


document.querySelectorAll(".close").forEach(button => {



    button.addEventListener("click", () => {



        const parentWindow = button.closest(".window");



        closeWindow(parentWindow);



    });



});





// ==========================================================
// CLICK WINDOW TO FOCUS
// ==========================================================



windows.forEach(windowElement => {



    windowElement.addEventListener(

        "mousedown",

        () => {


            focusWindow(windowElement);


        }

    );



});





// ==========================================================
// START BUTTON
// ==========================================================


startButton.addEventListener("click", () => {



    startMenu.classList.toggle("hidden");



});





// close start menu when clicking desktop


document.getElementById("desktop")

.addEventListener("click", (event)=>{


    if(

        !event.target.closest("#start-menu")

        &&

        !event.target.closest("#start-button")

    ){


        startMenu.classList.add("hidden");


    }



});





// ==========================================================
// TASKBAR BUTTONS
// ==========================================================


function createTaskbarButton(windowElement){



    const existing = document.querySelector(

        `[data-task="${windowElement.id}"]`

    );



    if(existing) return;




    const button = document.createElement("button");



    button.className = "taskbar-button";



    button.dataset.task = windowElement.id;



    button.innerText =

    windowElement.querySelector(".title-left span")

    ?.innerText || "Window";




    button.addEventListener("click",()=>{



        if(windowElement.classList.contains("hidden")){


            openWindow(windowElement.id);


        }

        else {


            focusWindow(windowElement);


        }



    });



    taskbarPrograms.appendChild(button);



}





function removeTaskbarButton(id){



    const button = document.querySelector(

        `[data-task="${id}"]`

    );



    if(button){


        button.remove();


    }



}





// ==========================================================
// CLOCK
// ==========================================================


function updateClock(){



    const now = new Date();



    let hours = now.getHours();



    const minutes = now

    .getMinutes()

    .toString()

    .padStart(2,"0");



    const ampm = hours >= 12

    ? "PM"

    : "AM";



    hours = hours % 12;



    hours = hours || 12;



    clock.innerText =

    `${hours}:${minutes} ${ampm}`;



}



setInterval(updateClock,1000);


updateClock();







// ==========================================================
// WINDOW DRAGGING
// ==========================================================


let draggedWindow = null;

let offsetX = 0;

let offsetY = 0;



const desktop = document.getElementById("desktop");





document.querySelectorAll(".title-bar")

.forEach(titleBar => {



    titleBar.addEventListener("mousedown", (event)=>{


        const windowElement = titleBar.closest(".window");



        if(!windowElement) return;



        focusWindow(windowElement);



        draggedWindow = windowElement;



        const rect = windowElement.getBoundingClientRect();



        const desktopRect = desktop.getBoundingClientRect();




        offsetX = event.clientX - rect.left;


        offsetY = event.clientY - rect.top;



        event.preventDefault();



    });



});







document.addEventListener("mousemove",(event)=>{



    if(!draggedWindow) return;



    const desktopRect = desktop.getBoundingClientRect();



    let x = event.clientX

    - desktopRect.left

    - offsetX;



    let y = event.clientY

    - desktopRect.top

    - offsetY;





    // keep window inside desktop



    const maxX = desktop.clientWidth

    - draggedWindow.offsetWidth;



    const maxY = desktop.clientHeight

    - draggedWindow.offsetHeight;



    if(x < 0)

        x = 0;



    if(y < 0)

        y = 0;



    if(x > maxX)

        x = maxX;



    if(y > maxY)

        y = maxY;





    draggedWindow.style.left = x + "px";

    draggedWindow.style.top = y + "px";





});







document.addEventListener("mouseup",()=>{



    draggedWindow = null;



});







// ==========================================================
// MINIMIZE BUTTON
// ==========================================================


document.querySelectorAll(".minimize")

.forEach(button => {



    button.addEventListener("click",()=>{



        const windowElement = button.closest(".window");



        windowElement.classList.add("hidden");



        createTaskbarButton(windowElement);



    });



});







// ==========================================================
// MAXIMIZE BUTTON
// ==========================================================


document.querySelectorAll(".maximize")

.forEach(button => {



    button.addEventListener("click",()=>{



        const windowElement = button.closest(".window");



        toggleMaximize(windowElement);



    });



});









// ==========================================================
// MAXIMIZE SYSTEM
// ==========================================================


function toggleMaximize(windowElement){



    if(windowElement.dataset.maximized === "true"){



        restoreWindow(windowElement);



    }

    else {



        maximizeWindow(windowElement);



    }



}








function maximizeWindow(windowElement){



    // save original position


    windowElement.dataset.oldLeft =

    windowElement.style.left;



    windowElement.dataset.oldTop =

    windowElement.style.top;



    windowElement.dataset.oldWidth =

    windowElement.style.width;



    windowElement.dataset.oldHeight =

    windowElement.style.height;





    windowElement.style.left = "0px";

    windowElement.style.top = "0px";



    windowElement.style.width =

    "100%";



    windowElement.style.height =

    "100%";



    windowElement.dataset.maximized = "true";



}








function restoreWindow(windowElement){



    windowElement.style.left =

    windowElement.dataset.oldLeft || "50px";



    windowElement.style.top =

    windowElement.dataset.oldTop || "50px";



    windowElement.style.width =

    windowElement.dataset.oldWidth || "500px";



    windowElement.style.height =

    windowElement.dataset.oldHeight || "400px";



    windowElement.dataset.maximized = "false";



}








// ==========================================================
// DOUBLE CLICK TITLE BAR TO MAXIMIZE
// ==========================================================


document.querySelectorAll(".title-bar")

.forEach(titleBar=>{


    titleBar.addEventListener(

    "dblclick",

    ()=>{


        const windowElement =

        titleBar.closest(".window");



        toggleMaximize(windowElement);



    });



});








// ==========================================================
// WINDOW DEFAULT POSITIONS
// (makes each window appear slightly offset)
// ==========================================================



let windowOffset = 0;

function randomWindowPosition(windowElement){

    // Tablet & Mobile
    if(window.innerWidth <= 500){

        windowElement.style.left = "50%";
        windowElement.style.top = "50%";
        windowElement.style.transform = "translate(-50%, -50%)";

        return;

    }

}

function randomWindowPosition(windowElement){



    windowOffset += 35;



    if(windowOffset > 200){

        windowOffset = 0;

    }



    windowElement.style.left =

    (50 + windowOffset) + "px";



    windowElement.style.top =

    (50 + windowOffset) + "px";



}








// ==========================================================
// OPEN WINDOWS WITH RANDOM POSITIONS
// ==========================================================


const originalOpenWindow = openWindow;



openWindow = function(windowID){



    const windowElement =

    document.getElementById(windowID);



    if(

        windowElement

        &&

        windowElement.classList.contains("hidden")

    ){



        randomWindowPosition(windowElement);



    }



    originalOpenWindow(windowID);



};







// ==========================================================
// MUSIC DATABASE
// Replace these with your real releases
// ==========================================================

document.addEventListener("DOMContentLoaded",()=>{


    createFilters();


    displayAlbums(albums);



    yearFilter.addEventListener(
    "change",
    filterAlbums
    );


    genreFilter.addEventListener(
    "change",
    filterAlbums
    );


    tagFilter.addEventListener(
    "change",
    filterAlbums
    );


});
const albums = [


    {

        title:"The Robotic Jazz Club",

        type: "Album",

        date:"July 18, 2026",

        genre:"Abstract Jazz",

        artwork:"the robotic jazz club new artwork.jpg",

        tags:[

        "Abstract Electronic", "Jazz Fusion", "IDM",
         ],
         listen: "https://square-bot.bandcamp.com/album/the-robotic-jazz-club" 
      

    },


    {

        title:"a folktronic album",

        type: "Ep",

        date:"March 14, 2026",

        genre:"Folktronic",

        artwork:"Untitled SB folk.jpg",

        tags: [

        "Abstract Electronic", 
        "Folk", 
        "IDM",
        "Folktronic",
        "Sound Art",

           ],

           listen: "https://square-bot.bandcamp.com/album/a-folktronic-album" 

    },

    {

        title:"the essence of sound",

        type: "Album",

        date:"February 21, 2026",

        genre:"IDM",

        artwork:"digital essence sb 2026.jpg",

        tags: [

        "Abstract Electronic", 
        "IDM",

          ],
        listen: "https://square-bot.bandcamp.com/album/the-essence-of-sound" 

    },


    {

        title:"Light",

        type: "Album",

        date:"August 9, 2025",

        genre:"Abstract",

        artwork:"more vibrant sb grass.jpg",

        tags: [

        "Abstract Electronic", 
        "IDM",

          ],
        listen: "https://square-bot.bandcamp.com/album/light" 

    },

    {

        title:"KHROME",

        type: "Album",

        date:"April 7, 2025",

        genre:"Abstract IDM",

        artwork:"maybe final front cover - khrome final (1) (2).jpg",

        tags: [

        "Abstract Electronic", 
        "IDM",

          ],
        listen: "https://square-bot.bandcamp.com/album/khrome" 

    },

    {

        title:"growth.",

        type: "Album",

        date:"February 7, 2025",

        genre:"Abstract Lofi",

        artwork:"square_bot_lofi_piano_album_cover_drawn-transformed.jpeg",

        tags: [

        "Abstract Electronic", 
        "IDM",
        "Lofi",
        "Piano Lofi",

          ],
        listen: "https://square-bot.bandcamp.com/album/growth" 

    },


    {

        title:"morph",

        type: "Album",

        date:"October 25, 2024",

        genre:"Abstract",

        artwork:"more vibrant morph cover (1).jpg",

        tags: [

        "Abstract Electronic", 
        "IDM",
        "Acid",
        "Electronica",

          ],
        listen: "https://square-bot.bandcamp.com/album/morph" 

    },

    {

        title:"domo",

        type: "Album",

        date:"August 9, 2024",

        genre:"Audio Drama / Lofi",

        artwork:"domo vinyl front.jpg",

        tags: [

        "Abstract Electronic", 
        "Storytelling",
        "Lofi",
        "Audio Drama",

          ],
        listen: "https://square-bot.bandcamp.com/album/domo" 

    },

    {

        title:"Retro Renaissance",

        type: "Ep",

        date:"January 25, 2024",

        genre:"Electronica / Retro Pop",

        artwork:"1980.png",

        tags: [

        "Abstract Electronic", 
        "Electronica",
        "Pop",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/retro-renaissance" 

    },

    {

        title: "ACID\\\\\\\\",

        type: "Ep",

        date:"June 9, 2023",

        genre:"Electronic",

        artwork:"ACID.png",

        tags: [

        "Abstract Electronic", 
        "Electronica",
        "Acid",
        "Techno",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/acid" 

    },


    {

        title:"TRIPPY DAY",

        type: "Ep",

        date:"April 24, 2023",

        genre:"Electronic",

        artwork:"50f2c29d1ebb7aeca9ee583aba28b035.jpg",

        tags: [

        "Abstract Electronic", 
        "Electronica",
        "IDM",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/trippy-day" 

    },


    {

        title:"The Monster Of My Trauma",

        type: "Album",

        date:"January 15, 2023",

        genre:"Electronic",

        artwork:"the monster of my trauma..jpg",

        tags: [

        "Abstract Electronic", 
        "Avant-Garde Electronic",
        "IDM",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/the-monster-of-my-trauma" 

    },

    {

        title:"I Hit My F**king Elbow [explicit]",

        type: "Album",

        date:"November 20, 2022",

        genre:"Electronic",

        artwork:"bd8e0f7c4fbac4010aab33979c0b6095.jpg",

        tags: [

        "Abstract Electronic", 
        
        "IDM",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/i-hit-my-f-king-elbow-explicit" 

    },

    {

        title:"My attempt at deep house",

        type: "2-Track Single",

        date:"June 8, 2022",

        genre:"Deep House",

        artwork:"f4b37b09df625db2424fbe48292fe9dc.jpg",

        tags: [

        "Abstract Electronic", 
        "Deep House",
        "IDM",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/my-attempt-at-deep-house" 

    },

    {

        title:"OFF THE EDGE",

        type: "Ep",

        date:"May 29, 2022",

        genre:"Electronic",

        artwork:"a7e3b5ebf57b586f6cc554a6892557af.jpg",

        tags: [

        "Abstract Electronic", 
        "Retro",
        "IDM",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/off-the-edge" 

    },


    {

        title:"She called herself tiffany",

        type: "Album",

        date:"April 27, 2022",

        genre:"Electronic",

        artwork:"7c1c75c2d114f0e22c017d08c5b0583b.jpg",

        tags: [

        "Abstract Electronic", 
        
        "IDM",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/she-called-herself-tiffany" 

    },


    {

        title:"Fall.",

        type: "Album",

        date:"March 4, 2022",

        genre:"Electronic",

        artwork:"c4084b17e894e9b200aae09fa5b33dd6.jpg",

        tags: [

        "Abstract Electronic", 
        "Acid",
        "IDM",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/fall" 

    },


    {

        title:"I saw a movie a few days ago",

        type: "Ep",

        date:"February 15, 2022",

        genre:"Electronic",

        artwork:"4297ee6b7e933363fb8fa34608c02082.jpg",

        tags: [

        "Abstract Electronic", 
        "Chiptune",
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/i-saw-a-movie-a-few-days-ago" 

    },


    {

        title:"I call you my best friend",

        type: "Ep",

        date:"January 24, 2022",

        genre:"Electronic / IDM",

        artwork:"I call you my best friend.jpg",

        tags: [

        "Abstract Electronic", 
        "Computer Music",
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/i-call-you-my-best-friend" 

    },

    {

        title:"Just something i did in my free time",

        type: "Album",

        date:"January 14, 2022",

        genre:"Electronic / IDM",

        artwork:"43dfe34da63a24803a6f959f949be115.jpg",

        tags: [

        "Abstract Electronic", 
        "Computer Music",
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/just-something-i-did-in-my-free-time" 

    },


    {

        title:"03",

        type: "Album",

        date:"December 16, 2021",

        genre:"Electronic / IDM",

        artwork:"03.jpg",

        tags: [

        "Abstract Electronic", 
        
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/03" 

    },

    {

        title:"Theory of the human heart",

        type: "Single",

        date:"November 30, 2021",

        genre:"Abstract Electronic",

        artwork:"aa7876d880897bbe65c2484fa8f27e24.jpg",

        tags: [

        "Abstract Electronic", 
        
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/track/theory-of-the-human-heart" 

    },

    {

        title:"Atronaut",

        type: "Album",

        date:"November 17, 2021",

        genre:"Abstract Electronic",

        artwork:"updated atronaut cover.jpg",

        tags: [

        "Abstract Electronic", 
        
        "IDM",
        "Experimental",
        "Outsider Electronic",

          ],
        listen: "https://square-bot.bandcamp.com/album/atronaut" 

    },


    {

        title:"I don't have a name for this",

        type: "Album",

        date:"October 25, 2021",

        genre:"Abstract Electronic",

        artwork:"I don't have a name for this.jpg",

        tags: [

        "Abstract Electronic", 
        
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/i-dont-have-a-name-for-this" 

    },

    {

        title:"END TIMES",

        type: "Album",

        date:"August 24, 2021",

        genre:"Electronic",

        artwork:"updated END TIMES artwork final ver.jpg",

        tags: [

        "Abstract Electronic", 
        "Soundtrack",
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/end-times-soundtrack" 

    },

    {

        title:"Lauren",

        type: "Ep",

        date:"August 14, 2021",

        genre:"Electronic",

        artwork:"83024ec445cf471c4cf028dd53e27b71.jpg",

        tags: [

        "Abstract Electronic", 
        "Latin",
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/lauren" 

    },

    {

        title:"a walk to remember that i'm growing up",

        type: "Ep",

        date:"August 1, 2021",

        genre:"Electronic",

        artwork:"d6ad00f05aa0836586ef1c921b0cbd02.jpg",

        tags: [

        "Abstract Electronic", 
        
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/a-walk-to-remember-that-im-growing-up" 

    },

    {

        title:"Machine Bop, Pt. 2",

        type: "Album",

        date:"July 27, 2021",

        genre:"Electronic",

        artwork:"updated machine bop part 2.png",

        tags: [

        "Abstract Electronic", 
        "Sound Art",
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/machine-bop-pt-2" 

    },

    {

        title:"Thicc Emo Girl That Lives Across The Road",

        type: "Single",

        date:"July 11, 2021",

        genre:"Electronic",

        artwork:"388b2bd86ce0928df7d9da59d63d36ea.jpg",

        tags: [

        "Abstract Electronic", 
        "Electronica",
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/track/thicc-emo-girl-that-lives-across-the-road" 

    },

    {

        title:"Machine Bop",

        type: "Album",

        date:"July 8, 2021",

        genre:"Electronic",

        artwork:"machine bop j card.png",

        tags: [

        "Abstract Electronic", 
        "Sound Art",
        "IDM",
        "Experimental",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/machine-bop" 

    },

    {

        title:"a joke that kills",

        type: "Ep",

        date:"June 30, 2021",

        genre:"Abstract Trap",

        artwork:"A JOKE THAT KILLS.jpg",

        tags: [

        "Abstract Electronic", 
        "Trap",
        "IDM",
        "Experimental",
        "Dark Trap",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/a-joke-that-kills" 

    },

    {

        title:"Sad Walkman (EP Version)",

        type: "Ep",

        date:"June 12, 2021",

        genre:"Electronic",

        artwork:"Sad walkman pic - Square Bot.png",

        tags: [

        "Abstract Electronic", 
        "Outsider Electronic",
        "IDM",
        "Experimental",
        
        

          ],
        listen: "https://square-bot.bandcamp.com/album/sad-walkman-ep-version" 

    },

    {

        title:"Dumb Alien That Landed to Say Hi",

        type: "Album",

        date:"February 7, 2021",

        genre:"Electronic",

        artwork:"Dumb alien that landed to say hi pic - Square Bot.jpg",

        tags: [

        "Abstract Electronic", 
        "Outsider Electronic",
        "IDM",
        "Experimental",
        
        

          ],
        listen: "https://square-bot.bandcamp.com/album/dumb-alien-that-landed-to-say-hi" 

    },

    {

        title:"Down Town Chicken (2025 remaster)",

        type: "Single",

        date:"May 31, 2019",

        genre:"Electronic",

        artwork:"66b3994bd6aed084c789f933b4af0038.jpg",

        tags: [

        "Abstract Electronic", 
        "Outsider Electronic",
        "IDM",
        "Experimental",
        "Chiptune",
        
        

          ],
        listen: "https://square-bot.bandcamp.com/track/down-town-chicken-2025-remaster" 

    },




];







// ==========================================================
// GENERATE MUSIC GRID
// ==========================================================


const albumGrid = document.getElementById("album-grid");



function loadAlbums(){



    if(!albumGrid) return;



    albumGrid.innerHTML="";



    albums.forEach((album,index)=>{



        const card = document.createElement("div");



        card.className="album-card";



        card.innerHTML = `

            <img src="${album.artwork}">

            <span>${album.title}</span>

        `;



        card.addEventListener("click",()=>{


            openAlbum(album);



        });



        albumGrid.appendChild(card);



    });



}



loadAlbums();







// ==========================================================
// ALBUM DETAILS WINDOW
// ==========================================================


function openAlbum(album){



    const albumWindow =

    document.getElementById("album-window");



    const details =

    document.getElementById("album-details");





    details.innerHTML = `



        <img class="album-details-cover"

        src="${album.artwork}">



        <h1>${album.title}</h1>



        <p>
        ${album.type}
        </p>



        <p>

        Released:

        ${album.date}

        </p>



        <p>

        Genre:

        ${album.genre}

        </p>



        <p>
        Tags:

        ${album.tags}

        </p>


        <a href="${album.listen}">
        Listen
        
        
        </a>


    `;



    openWindow("album-window");



}




// ==========================================================
// non canon MUSIC DATABASE
// Replace these with your real releases
// ==========================================================

document.addEventListener("DOMContentLoaded",()=>{


    createFilters();


    displayAlbums(albums);



    yearFilter.addEventListener(
    "change",
    filterAlbums
    );


    genreFilter.addEventListener(
    "change",
    filterAlbums
    );


    tagFilter.addEventListener(
    "change",
    filterAlbums
    );


});
const noncanonAlbums = [




    {

        title:"i took the wrong bus and now i’m in orbit [songs from the vault]",

        type: "Album",

        date:"October 5, 2025",

        genre:"Electronic",

        artwork:"for some reason, i was brought to space. (1).jpg",

        tags: [

        "Abstract Electronic", 
        "IDM",
        "Lofi",
        "Demos",

          ],
        listen: "https://square-bot.bandcamp.com/album/i-took-the-wrong-bus-and-now-i-m-in-orbit-songs-from-the-vault" 

    },

    {

        title:"Parallax (the lost video game soundtrack)",

        type: "Album",

        date:"May 8, 2025",

        genre:"Electronic",

        artwork:"parallax cover blank w fvgs text only.jpg",

        tags: [

        "Abstract Electronic", 
        "IDM",
        "Soundtrack",
        "Concept Album",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/parallax-the-lost-video-game-soundtrack" 

    },

    {

        title:"Mixtape: Nyx [explicit]",

        type: "Ep",

        date:"December 6, 2024",

        genre:"Abstract Rap",

        artwork:"nyx album cover.jpg",

        tags: [

        "Abstract Rap", 
        "Grime",
        "Hip-Hop",
        

          ],
        listen: "https://square-bot.bandcamp.com/album/mixtape-nyx-explicit" 

    },



];







// ==========================================================
// GENERATE non-canon MUSIC GRID
// ==========================================================


const noncanonAlbumGrid = document.getElementById("noncanon-album-grid");



function loadNoncanonAlbums(){



    if(!noncanonAlbumGrid) return;

     noncanonAlbumGrid.innerHTML = "";



    noncanonAlbums.forEach(album=>{



        const card = document.createElement("div");



        card.className="album-card";



        card.innerHTML = `

            <img src="${album.artwork}">

            <span>${album.title}</span>

        `;



        card.addEventListener("click",()=>{
        openNoncanonAlbum(album);
          });



        



        noncanonAlbumGrid.appendChild(card);



    });



}



loadNoncanonAlbums();







// ==========================================================
// ALBUM DETAILS WINDOW
// ==========================================================


function openNoncanonAlbum(album){



    const albumWindow =

    document.getElementById("noncanonalbum-list");



    const details =

    document.getElementById("noncanon-album-details");





    details.innerHTML = `



        <img class="album-details-cover""

        src="${album.artwork}">



        <h1>${album.title}</h1>



        <p>
        ${album.type}
        </p>



        <p>

        Released:

        ${album.date}

        </p>



        <p>

        Genre:

        ${album.genre}

        </p>



        <p>
        Tags:

        ${album.tags}

        </p>


        <a href="${album.listen}">
        Listen
        
        
        </a>
    


    `;



    openWindow("noncanonalbum-details-window");



}



// ==========================================================
// ARCHIVE DATABASE
// ==========================================================

const archiveItems = [

    {
        year: "2021",

        releases: [

            {
                title: "I tried to make fire",
                artwork: "I Tried To Make Fire - Square Bot.jpg",
                
                type: "Album",
                
            },

            {
                title: "Inside my gaming console",
                artwork: "Inside my gaming console pic - Square Bot.jpg",
            
                type: "Ep",
                
            },

            {
                title: "Mistakes at the party",
                artwork: "Mistakes at the party pic 2 - Square Bot.jpg",
                
                type: "Ep",
                
            },

            {
                title: "Cute ghost things",
                artwork: "Cute ghost things pic - Square Bot (1).jpg",
            
                type: "Album",
                
            },

            {
                title: "Hello my old friend",
                artwork: "Hello my old friend pic - Square Bot.jpg",
                
                type: "Album",
                
            },

            {
                title: "This is me trying to make music",
                artwork: "This is me trying to make music pic - Square Bot.jpg",
            
                type: "Album",
                
            },

            

            

        ]
    },

    {
        year: "2020",

        releases: [

            {
                title: "Music that brings back retro, hope your happy [Unreleased]",
                artwork: "Hope your happy pic - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "I made music today",
                artwork: "i made music today pic - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "Nice days",
                artwork: "Nice days pic - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "Love, hate, i can't say goodbye",
                artwork: "Love. hate. i can't say goodbye pic - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "I dare you to listen to this",
                artwork: "I dare you to listen to this pic 2020 - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "Blush",
                artwork: "blush pic - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "Welp.. this sucks",
                artwork: "Welp.. this sucks pic - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "the b.o.t. project",
                artwork: "404.jpg",
               
                type: "Album",
                
            },

            {
                title: "Fear of falling",
                artwork: "404.jpg",
               
                type: "Album",
                
            }

        ]
    },

    {
        year: "2019",

        releases: [

            {
                title: "Something that makes you go wow",
                artwork: "IMG_2291.jpg",
               
                type: "Ep",
                
            },

            {
                title: "Happy joys",
                artwork: "Happy Joys pic - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "Kinda sad today [Unreleased]",
                artwork: "Kinda sad today pic - Square Bot.jpg",
               
                type: "Ep",
                
            },

            {
                title: "Flight pt, 1",
                artwork: "Flight pt 1 pic updated.jpg",
               
                type: "Ep",
                
            },

            {
                title: "Faceless",
                artwork: "Faceless - Square Bot 2.jpg",
               
                type: "Album",
                
            },

            {
                title: "Flight pt, 2",
                artwork: "Flight pt 2 pic updated.jpg",
               
                type: "Ep",
                
            },

            {
                title: "Coming home",
                artwork: "Coming home pic - Square Bot.png",
               
                type: "Album",
                
            },

            {
                title: "10-5+5=10",
                artwork: "10-5+5=10 pic - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "Atmosphere",
                artwork: "Atmosphere pic - Square Bot 2.jpg",
               
                type: "Ep",
                
            },

            {
                title: "Blue jellyfish in space",
                artwork: "Blue Jellyfish in Space pic - Square Bot.jpg",
               
                type: "Ep",
                
            },

            {
                title: "Sleeping dogs",
                artwork: "Sleeping dogs pic - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "Unknown Title Name",
                artwork: "Unknown Title Name pic - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "Doggy's and Donuts",
                artwork: "404.jpg",
               
                type: "Single",
                
            }

        ]
    },

    {
        year: "2018",

        releases: [

            {
                title: "Mischief",
                artwork: "mischief pic - Square Bot.png",
               
                type: "Ep",
                
            },

            {
                title: "Louder than words",
                artwork: "Louder than words - Square Bot.png",
               
                type: "Album",
                
            },

            {
                title: "Brain teaser",
                artwork: "Brain teaser pic - Square Bot.jpg",
               
                type: "Album",
                
            },

            {
                title: "Broken Paradise",
                artwork: "Broken paradise pic updated.jpg",
               
                type: "Ep",
                
            },

            {
                title: "No boundaries",
                artwork: "No boundaries pic - Square Bot.png",
               
                type: "Album",
                
            },

            {
                title: "Square-mas",
                artwork: "Square Bot christmas EP pic.jpg",
               
                type: "Ep",
                
            },

            {
                title: "Warzone",
                artwork: "Warzone pic updated.jpg",
               
                type: "Album",
                
            },

            {
                title: "Numbers & Technology",
                artwork: "Numbers and technology (reuploaded version) pic - Square Bot.jpg",
               
                type: "Ep",
                
            },

            

        ]
    },

    {
        year: "2017",

        releases: [

            {
                title: "Learned from my mistakes",
                artwork: "IMG_20170821_142502_781.jpg",
               
                type: "Ep",
                
            },

            {
                title: "Future",
                artwork: "404.jpg",
               
                type: "Album",
                
            },

            {
                title: "Just n time",
                artwork: "1600x1600 just in time pc.png",
               
                type: "Single",
                
            },

            {
                title: "Peace by peace",
                artwork: "peace by peace pic 1.jpg",
               
                type: "Ep",
                
            },

            {
                title: "When robots take over",
                artwork: "a3764104971_10.jpg",
               
                type: "Album",
                
            },

            {
                title: "Frequency",
                artwork: "404.jpg",
               
                type: "Album",
                
            },

            {
                title: "Secret folder file 10 code 0-36",
                artwork: "Secret folder file 10 code 0-36 pic.png",
               
                type: "Ep",
                
            },

            {
                title: "your the one",
                artwork: "404.jpg",
               
                type: "Single",
                
            },

            {
                title: "Title of the album is typed here",
                artwork: "title of the album is typed here pic.png",
               
                type: "Album",
                
            },

            {
                title: "A robot who is square",
                artwork: "a robot who is square pic.png",
               
                type: "Album",
                
            },

            {
                title: "Untitled 2017",
                artwork: "Untitled 2017 pic 2017.png",
               
                type: "Ep",
                
            },

            {
                title: "What Ever",
                artwork: "404.jpg",
               
                type: "Single",
                
            },

            {
                title: "Soundwave",
                artwork: "a2829371598_10.png",
               
                type: "Ep",
                
            },

            {
                title: "Dreamstate",
                artwork: "404.jpg",
               
                type: "Album",
                
            },

            {
                title: "Freedom",
                artwork: "404.jpg",
               
                type: "Album",
                
            },

            {
                title: "Pressure",
                artwork: "404.jpg",
               
                type: "Album",
                
            },

            {
                title: "Maximum Overload",
                artwork: "404.jpg",
               
                type: "Single",
                
            },

            

        ]
    }

];

// ==========================================================
// GENERATE ARCHIVE GRID
// ==========================================================
const archiveGrid = document.getElementById("albumarchive-grid");


function loadArchive(){

    if(!archiveGrid) return;

    archiveGrid.innerHTML = "";

    archiveItems.forEach(section=>{

        // YEAR TITLE

        const yearTitle = document.createElement("h2");

        yearTitle.className = "archive-year";

        yearTitle.innerText = section.year;

        archiveGrid.appendChild(yearTitle);

        // RELEASES

        section.releases.forEach(release=>{

            const card = document.createElement("div");

            card.className = "album-card";

            card.innerHTML = `
                <img src="${release.artwork}">
                <span>${release.title}</span>
                <span>"${release.type}"</span>
            `;

            card.addEventListener("click",()=>{

                openArchiveRelease(release);

            });

            archiveGrid.appendChild(card);

        });

    });

}

loadArchive();




// ==========================================================
// OPEN ARCHIVED RELEASE
// ==========================================================

function openArchiveRelease(release){


    const details = document.getElementById("archivedalbum-details");


    details.innerHTML = `

        <img class="album-details-cover"

        src="${release.artwork}">


        <h1>

            ${release.title}

        </h1>


        

        <p>
         ${release.type}
        </p>


        <p>

            Released:

            ${release.year}

        </p>


        <p>

            Type:

            ${release.type}

        </p>


       


        

    `;


    openWindow("archivedalbum-window");


};




// ==========================================================
// GALLERY DATABASE
// ==========================================================


const galleryItems=[

  
    {
        year:"2025-2024", 
        
        images:[
            
            
            "2025 khrome photoshoot.jpg",
            "warm sb 2026 (1).jpg",
            "square bot 2025 growth photoshoot (fixed).jpg",
            "sway glory version sb 2026.jpg",
            
            "motion pic sb finished.jpg",
            "look sb 25.jpg",
            "IMG_1113.jpg",
            "IMG_8639 (1).jpg",
            "IMG_2846 vibrant.jpg",
            "IMG_1174.jpg",
            "domo cover (Digital Poster).jpg",
            "polish.jpg",
            "sb 2025 new.jpg",
            "soft faded .jpg",
            
        ]
    },

    



    

    {
        year: "2022-2021",
        
        images:[
        
           
             "Untitled design (7).jpg",
             "Square Bot (digital Poster) (1).jpg",
             "2922730C-F2A7-4AF1-B41C-A8F091C32009 (1).jpg",
             "21 Square Bot.jpg",
             "IMG_4694.jpg",
             "IMG_7924.jpg",
             "IMG_7889 (1).jpg",
             "square bot poster.jpg",
             "Untitled (57).jpg",
             "Untitled design (2).png",
             "Untitled (56).jpg",
             "Untitled (66).jpg",
             "RED 21 Square bot.jpg",
             "IMG_7894.jpg",
             "IMG_7887.jpg",
             "SB 21.jpg",
             "Untitled - 2021-11-17T180835.609.jpg",
             


        ]
        
    },

   

    

    {
        year: "2020-2019",
        
        images:[
        
        "270402_core_by_andreybobir-d68v5lv_20170808193949263.jpg",
        "IMG_2837.jpg",
        "Square Bot 2020 pic cool.jpg",
        "IMG_1482.jpg",
        "IMG_2811.jpg",
        "IMG_2834.jpg",
        "IMG_2843.jpg",
        "IMG_1468.jpg",
        "Square Bot 2020 pink future.jpg",
        "270402_core_by_andreybobir-d68v5lv_20170808195435088.jpg",
        "thumbnail (8).jpg",
        "IMG_3816.jpg",
        "img-0299_orig.jpg",
        "32084160_376549302864190_556451135326519296_n.jpg",
        "28764128_2103559949927629_1044005690940588032_n.jpg",


        ]
    },

    {
        year: "2018-2017",
        
        images:[
        
        "IMG_0015.jpg",
        "IMAG0205.jpg",
        "IMG_0027.jpg",
        "270402_core_by_andreybobir-d68v5lv_20170514023821870.jpg",
        "270402_core_by_andreybobir-d68v5lv_20170512000606897 blank.jpg",
        "32103357-247198009163655-3676383183789621248-n-1_orig.jpg",
        "21373658_118159992183163_8689984790008430592_n.jpg",
        "21435394_1639353986138893_4212529216979206144_n.jpg",
        "SB pic 2018.png",
        "SB photo 2019.jpg",
        "Square Bot 2018 pic.png",
        "Square Bot background for spotify.png",
        "SB .png",
        "WIN_20170907_02_40_26_Pro.jpg",

        ]
    }

    

   

    

    
    
   


];

const galleryGrid = document.getElementById("gallery-grid");


function loadGallery(){


    if(!galleryGrid) return;


    galleryGrid.innerHTML = "";



    galleryItems.forEach(section=>{


        // YEAR TITLE

        const yearTitle = document.createElement("h2");

        yearTitle.className = "gallery-year";

        yearTitle.innerText = section.year;


        galleryGrid.appendChild(yearTitle);



        // IMAGES

        section.images.forEach(image=>{


            const card = document.createElement("div");


            card.className = "media-card";



            card.innerHTML = `

                <img src="${image}">

            `;



            card.addEventListener("click",()=>{


                openImageViewer(image);


            });



            galleryGrid.appendChild(card);



        });



    });


}



loadGallery();






// ==========================================================
// IMAGE VIEWER
// ==========================================================


function openImageViewer(imageSource){


    const viewerWindow = 
    document.getElementById("image-viewer-window");


    const viewerImage =
    document.getElementById("viewer-image");



    viewerImage.src = imageSource;



    openWindow("image-viewer-window");



};









// ==========================================================
// NEWS DATABASE
// ==========================================================


const newsFeed =

document.getElementById("news-feed");





const news=[


    {

        title:"Beep Boop",

        text:

        "Welcome to Square Bot_OS."

    },


    



];





function loadNews(){



    if(!newsFeed)return;



    news.forEach(post=>{



        const item=document.createElement("div");



        item.className="news-post";



        item.innerHTML=`


        <h3>

        ${post.title}

        </h3>


        <p>

        ${post.text}

        </p>


        `;



        newsFeed.appendChild(item);



    });



}



loadNews();












// ==========================================================
// LORE DATABASE
// ==========================================================

const loreEntries = [

    {

        year: "2017",

        title: "Square Bot Build",

        poster: "SB pic 2018.png",

        text: `
        Square Bot was designed with a sleek silver Head and was equipped with a number of advanced sensors that allowed it to
analyze sound data and recreate sound scenarios with great accuracy. The Square Bot's programming also provided advanced
artificial intelligence capabilities, allowing it to learn from its surroundings and improve its musical performance over
time.

The Shell is an unknown/unnamed human male body that is above the age of 18 that was infused with robotic components and
the square bot program, the only outside feature of the shell that is robotic is it’s head.
        `

    },

    {

        year: "April 2017",

        title: "Origin",

        poster: "origin square bot lore poster.jpg",

        text: `
        in a small tech lab in the year 2017, located in the United States at a non-disclosed location. The Robot was created. a
robot that could not only replicate any sound but also generate new and unique beats on its own. It could also produce
vocals if it saw fit. the human body code-named “The Shell” was a male donor who gave their body to this project under the
knowledge that his body would be used for good. The human male requested to remain anonymous in the recorded logs of this
project.

It took time, but the robot started to comprehend the elements of sound and what made music an experience, and what made
it universal to all creatures.

The Robot was given the name “Square Bot”, named after it’s internal program code-name “project: Bot.Square_OS”

The concept of this program and robot was conceived in 2016. As the years passed, the Robot started to develop it’s own
consciousness and it’s own personality.
        `

    },

    {

        year: "August 2024",

        title: "Enter: domo",

        poster: "domo lore poster squarebot.jpg",

        text: `
        In the year 2024, A mysterious man named "Domo" captures and forces Square Bot to make an album that will delete the soul
of whoever listens to it and leave them as a zombie-like husk, Behind Domo’s back Square Bot Sends a warning to fans to
not listen to the album but Domo reveals that he heard everything and warped the audio so the fans are still in the dark
about Domo’s plan. Square Bot continues making the album while continuously sending warnings to fans so Domo decides to
use an aux cord to inject a digital virus to delete Square Bot’s consciousness and the virus takes control to finish the
album. Square Bot finds itself in a digital limbo where he encounters his human half that tells him the only way to
reverse this deletion is to find the override button in the core of his system, at the cost of them merging they must do
it together to defeat Domo but then the digital embodiment of the virus shows itself and informs them that it is embedding
into Square Bot’s robotic DNA. After defeating the virus, Square Bot and it’s human half find the button and merge and
destroy the album in the process.
        `

    },

    {

        year: "November 2025",

        title: "Anomaly",

        poster: "anomaly poster.jpg",

        text: `
        An event happened in 2025 that caused music from 2017-2021 to be erased, and some to be unlistenable to the human ear.

The virus that was thought to be defeated in the digital limbo was still hidden in parts of Square Bot’s program. It found
it’s way to a part of the program that controls external output from the shell, the virus then sent out a shockwave that
warped space-time and caused half of Square Bot’s music to be erased or rewritten in history as unlistenable to the human
ear. The event was irreversible, even when the virus was finally defeated and erased from the program; the damage was
done.
        `

    },

    {

        year: "January 2026",

        title: "Null",

        poster: "NULL a square bot lore event 3 color.jpg",

        text: `
        After the events of “Anomaly” that warped space-time and caused half of Square Bot’s music to be erased or rewritten in
history as unlistenable to the human ear. The event was irreversible, and not only did it damage time-space, it also
damaged the city surrounding Square Bot at the time of the event. in the wake of the chaos of the damage, the city labeled
Square Bot an enemy of the country. Square Bot found itself in hiding, trying to find ways to undo the event or at least
reverse the damage done to the city. Using it’s soundwave detector, Square Bot finds an opening between universes that
shouldn’t exist, caused by the warping of space-time. Square Bot steps through the inward warping frame and finds itself
in a dimensional space-void where everything and anything is happening all at once but also not happening at all, the
place of all choices to ever be made and to never be made. Square Bot meets a being known as “Null” The being informs
Square Bot that Square Bot has come to this place to make a choice and Null will grant Square Bot the power to alter
space-time but the limits of this power is that Square Bot can only reverse one part of the event, the erasing of his
music or reverse the damage on the city. but before he makes that choice, Square Bot must be proven worthy of that choice.
The being entered Square Bot’s digital soul, where the being and Square Bot saw Square Bot’s feelings towards humanity and
music. Null, being moved by the true repentance of Square Bot wanting to right the wrongs that the virus caused, decides
to grant Square Bot the power to alter space-time. without hesitation, Square Bot reverses the moments of destruction on
the city and, in turn, reverses being labeled a fugitive. everything was back to normal, somewhat.
        `

    }

];




const loreList = document.getElementById("lore-list");

function loadLore(){

    if(!loreList) return;

    loreList.innerHTML = "";

    loreEntries.forEach(entry=>{

        const card = document.createElement("div");

        card.className = "lore-card";

        card.innerHTML = `

            <img class="lore-poster"
            src="${entry.poster}">

            <div class="lore-info">

                <span class="lore-year">
                    ${entry.year}
                </span>

                <h2>
                    ${entry.title}
                </h2>

                <p>
                    ${entry.text}
                </p>

            </div>

        `;

        loreList.appendChild(card);

    });

}

loadLore();








// ==========================================================
// BOOTUP FLOPPY DISK SYSTEM
// ==========================================================



let systemUnlocked = false;



function createBootScreen(){



    if(sessionStorage.getItem("bootComplete"))

    return;



    const boot=document.createElement("div");



    boot.id="boot-screen";



    boot.innerHTML=`


        <h1>

        Insert Floppy Disk

        </h1>



        <p>

        Please insert OS floppy disk to continue.

        </p>



        <button>

        Insert Disk

        </button>


    `;



    document.body.appendChild(boot);



    boot.querySelector("button")

    .addEventListener("click",()=>{



        boot.style.display="none";



        sessionStorage.setItem(

        "bootComplete",

        "true"

        );



    });



}



createBootScreen();








// ==========================================================
// REBOOT WHEN LEAVING PAGE
// ==========================================================



window.addEventListener(

"beforeunload",

()=>{


    sessionStorage.removeItem(

    "bootComplete"

    );


});








// ==========================================================
// INITIAL SYSTEM START
// ==========================================================



console.log(

"Square Bot_OS Loaded"

);


// ==========================================================
// DESKTOP ICON CLICK HANDLER
// ==========================================================

document.querySelectorAll(".desktop-icon").forEach(icon => {

    icon.onclick = function(){

        const target = this.getAttribute("data-window");

        openWindow(target);

    };

});

/* ==========================================
   WINDOW RESIZING
========================================== */

let resizingWindow = null;

let startWidth;

let startHeight;

let startMouseX;

let startMouseY;



document.querySelectorAll(".resize-handle").forEach(handle=>{

    handle.addEventListener("mousedown",(e)=>{

        resizingWindow = handle.closest(".window");



        startWidth = resizingWindow.offsetWidth;

        startHeight = resizingWindow.offsetHeight;



        startMouseX = e.clientX;

        startMouseY = e.clientY;



        e.preventDefault();

        e.stopPropagation();

    });

});



document.addEventListener("mousemove",(e)=>{

    if(!resizingWindow) return;



    let newWidth =

        startWidth +

        (e.clientX - startMouseX);



    let newHeight =

        startHeight +

        (e.clientY - startMouseY);



    /* minimum size */

    if(newWidth < 300)

        newWidth = 300;



    if(newHeight < 220)

        newHeight = 220;



    resizingWindow.style.width =

        newWidth + "px";



    resizingWindow.style.height =

        newHeight + "px";



});



document.addEventListener("mouseup",()=>{

    resizingWindow = null;

});


