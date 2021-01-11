//canvas
let canvas = document.getElementById('c1');
let ctx = canvas.getContext('2d');
window.onload = create;

// -----------------------------------------------------------------------------

// jour :       xx       vitesse ------|-    |    taille  ------|-       [Start/pause]
// population : xx       quadrillage [o]     |    aléatoire [o]          [Reset]

var simulation = {
  taille : 1, // 1 à 25
  w : 0,
  h : 0,
  vitesse : 5, // 1 = 10mm | 100 = 1sec
  mode :  true, // vide | aléatoire
  quad : true, // quadrillage

  fond : 'rgb(238,238,238)',
  couleur : 'black',
  marge : 60,

  time : 0,
  jour : 0,
  start : false, //commencer
  population : 0
};

var menu = 0;
var tab=[];

function generate(){

  simulation.w = (window.innerWidth)/simulation.taille-1;
  simulation.h = (window.innerHeight-simulation.marge)/simulation.taille-1;

  tab=[];
  for (var i=0;i<simulation.w;i++){
    tab[i]=[];
    for (var j=0;j<simulation.h;j++){
      tab[i][j]=0;
      if (simulation.mode) tab[i][j]=Random(0,1);
    }
  }

}

// -----

function create(){
  generate();

	updatef();
}

// -- fonction principale --

function updatef(){

  window.requestAnimationFrame(updatef);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = simulation.fond;
	ctx.fillRect(0, simulation.marge, window.innerWidth,window.innerHeight);

  //interface
  ctx.font = 'bold 20px Biome';
  ctx.fillStyle = 'rgb(0,127,127)';
  ctx.fillText('Jour : ' + simulation.jour, 25, 25);
  ctx.fillText('Population : ' + simulation.population, 25, 50);
  ctx.fillRect(200,10,2,46);
  ctx.fillText('[Espace] pour commencer / arrêter', 225, 25);
  ctx.fillText('[Entré] pour rénitialiser', 225, 50);
  ctx.translate(0,simulation.marge);

  // nouvelle table
  Ntab=[]
  for (var i=0;i<simulation.w;i++){
    Ntab[i]=[]
    for (var j=0;j<simulation.h;j++){
      Ntab[i][j]=0;
    }
  }
  simulation.population=0;

  // ancienne table
  for (var i=1;i<simulation.w-1;i++){
    for (var j=1;j<simulation.h-1;j++){
      //calcul
      var voisin=tab[i-1][j]+tab[i-1][j-1]+tab[i-1][j+1]+tab[i+1][j]+tab[i+1][j+1]+tab[i+1][j-1]+tab[i][j-1]+tab[i][j+1];
      if (tab[i][j]==0 && voisin==3) Ntab[i][j]=1;
      if (tab[i][j]==1) {
        if (voisin>1 && voisin<4) { Ntab[i][j]=1; } else { Ntab[i][j]=0; }
      }
      // affichage
      ctx.fillStyle=simulation.couleur;
      if (simulation.taille>4 && simulation.quad) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = simulation.couleur;
        ctx.strokeRect(simulation.taille*i,simulation.taille*j,simulation.taille,simulation.taille);
      }
      if (tab[i][j]==1) {
        simulation.population += 1;
        ctx.fillRect(simulation.taille*i,simulation.taille*j,simulation.taille,simulation.taille);
      }
    }
  }

  //translation
  if (simulation.start) {
    tab=Ntab;
    simulation.jour+=1;
  }

}


// -----------------------------------------------------------------------------

document.onmousedown = function(event) {

  var xx = Math.round(event.clientX/simulation.taille);
  var yy = Math.round((event.clientY-simulation.marge)/simulation.taille);

  tab[xx][yy] = (tab[xx][yy] == 0) ? 1 : 0;
}

document.onkeydown = function(event) {
  var keycode = event.keyCode;
  if (keycode == 32) {
    simulation.start = !simulation.start;
  }
  if (keycode == 13) {
    generate();
    simulation.start=false;
    simulation.jour=0;
  }
}

function Random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}
