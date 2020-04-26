class PuntualLight {
  constructor(c,d,id){
    this.enabled    = c.enabled;
    this.p          = c.p;
    this.c          = c.c;
    this.controller = d;
    this.b_mult     = c.b_mult; //cuanto mas alto, mas lejosllega
    this.id         = id;

    this.g       = 2;
    this.r_s     = 25;
    this.max_l_d = 0;
    this.max_g_s = 0;
    this.g_count = 0;
    this.ray = null;
  }

  setPosition(x,y){
    this.p[0] = x;
    this.p[1] = y;
  }

  setEnabled(e){
    this.enabled = e;
  }

  update(){
    //se calcula la maxima separacion que podrian alcanzar los rayos
    this.max_l_d =  (Math.sin(1*Math.PI/180)*255*this.b_mult) | 1 +1;
    this.max_g_s =  this.max_l_d*360;
    //se trazan los rayos de la fuente de luz

    for (this.g=0; this.g < this.max_g_s; this.g++){ // se crean los "rayos de luz", es una fuente puntual
        this.ray = new Ray({
          'ctrl':  this.controller,
          'g':     this.g/this.max_l_d,
          't_d':   1,
          'light': this,
          'b_mult':this.b_mult
        });
        this.ray.trace();
    }

  }

}
