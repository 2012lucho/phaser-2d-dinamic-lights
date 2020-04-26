class Game{
  constructor(game){
    this.lights_ctrl = new LightsController({
      'screen_w':1920,
      'screen_h':1080,
      'scale':5,
      'update_frame_skip':0,
      'game':game
    });

    this.lights_ctrl.addLight({'p':[200,200], 'c':[255,255,0], 'enabled':1, 'b_mult':0.5 });
    this.lights_ctrl.addLight({'p':[500,500], 'c':[0,255,255], 'enabled':1, 'b_mult':0.5 });
    this.lights_ctrl.addLight({'p':[200,200], 'c':[0,250,0],   'enabled':1, 'b_mult':0.5 });

  }
}


var config = {
    width: 960,
    height: 540,
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    pixelArt: 0,
    backgroundColor: '#ffffff',
    scene: {
        create: create,
        preload: preload,
        update: update
    }
};

function preload ()
{
   this.load.image('pic', 'assets/artz.png');
}

var game = new Phaser.Game(config);
var gm = new Game(game);
var ligthController = gm.lights_ctrl;

var xx, c, cc=0;

//p=posicion c=color rgb i=intensidad a=activa

var l_amb   = [255,255,255,10];
var l_obs   = [];

function create ()
{
    this.add.image(250, 164, 'pic');
    ligthController.create(this);

    //se generan obstaculitos
    newObs(300,100);
    newObs(300,200);
    newObs(300,300);
    newObs(300,400);
}

function newObs(x,y){
  for (let i=0; i< 100;i++){
    ligthController.setObsPixel(x+i,y+i,1);
    ligthController.setObsPixel(x+i,y+i+ligthController.scale,1);
  }
}

var ddd=0;
function update ()
{
    ligthController.update();

    ligthController.setLightPosition(1, game.input.mousePointer.position.x, game.input.mousePointer.position.y);

  //  ddd++;
//    if(ddd>100){ ligthController.setLightEnabled(2,true); }
  //  if(ddd>200){ ligthController.setLightEnabled(2,false); ddd=0; }

  //
}
