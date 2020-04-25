class Light {
  constructor(c,d,id){
    this.enabled    = c.enabled;
    this.i          = c.i;
    this.p          = c.p;
    this.c          = c.c;
    this.controller = d;
    this.b_mult     = c.b_mult; //cuanto mas alto, mas lejosllega
    this.id         = id;

    this.ray_step = 1;
    this.up_c     = 0;

    this.d_x = 0;
    this.d_y = 0;
    this.d_v = 0.1;
    this.ps   = 0;
    this.e   = this.i;
    this.px  = 0;
    this.py  = 0;
    this.g   = 0;
    this.k   = 0;
    this.brillo = 0;

    this.o_m   = 0;
    this.o     = 0;
    this.r_c_l = 0;
    this.g_c_l = 0;
    this.b_c_l = 0;
    this.r_c_m = 0;
    this.g_c_m = 0;
    this.b_c_m = 0;
    this.r_c   = 0;
    this.g_c   = 0;
    this.b_c   = 0;
  }

  setPosition(x,y){
    this.p[0] = x;
    this.p[1] = y;
  }

  setEnabled(e){
    this.enabled = e;
  }

  update(){
    //se trazan los rayos de la fuente de luz
    this.px  = this.p[0]; //px inicial
    this.py  = this.p[1]; // py inicial
    this.e   = this.i;    // valor de brillo, que definira la opacidad
    //this.up_c ++;

    for (this.g=0; this.g < 360; this.g+= this.ray_step){ // se crean los "rayos de luz", es una fuente puntual
      //d_y = opuesto d_x =adyacente d_v = hipotenusa
      //d_y = desplazamiento y d_x = desplazamiento x  game.loop.actualFps
      this.d_y = Math.sin(this.g+this.up_c)*this.d_v;
      this.d_x = Math.cos(this.g+this.up_c)*this.d_v;

      for(this.brillo = 1; this.brillo < this.e*this.b_mult; this.brillo++){
          this.px = this.d_x*this.brillo+this.p[0];
          this.py = this.d_y*this.brillo+this.p[1];

          this.ps = Math.floor(this.py) * this.controller.m_width + Math.floor(this.px);

          if(this.py > 0 && this.px > 0 && this.px < this.controller.m_width && this.py < this.controller.m_height){
            if(this.controller.lights_obs[this.ps] != 1  //los obstaculos no se iluminan
                ){
              if (this.controller.lights_map_ul[this.ps] != this.id){ //no se reewscribe un lugar por donde ya paso esta luz
                  this.r_c_l = this.c[0];
                  this.g_c_l = this.c[1];
                  this.b_c_l = this.c[2];

                  this.r_c_m = this.controller.lights_map_r[this.ps];
                  this.g_c_m = this.controller.lights_map_g[this.ps];
                  this.b_c_m = this.controller.lights_map_b[this.ps];

                  //
                  this.k = 255-this.brillo/this.b_mult;
                  this.r_c_l = this.r_c_l / (255/this.k);
                  this.g_c_l = this.g_c_l / (255/this.k);
                  this.b_c_l = this.b_c_l / (255/this.k);

                  //suma de las luces
                  this.r_c = Math.round((1 - (1 - this.r_c_l / 255) * (1 - this.r_c_m / 255)) * 255);
                  this.g_c = Math.round((1 - (1 - this.g_c_l / 255) * (1 - this.g_c_m / 255)) * 255);
                  this.b_c = Math.round((1 - (1 - this.b_c_l / 255) * (1 - this.b_c_m / 255)) * 255);

                  this.controller.lights_map_r [this.ps]  = this.r_c;
                  this.controller.lights_map_g [this.ps]  = this.g_c;
                  this.controller.lights_map_b [this.ps]  = this.b_c;
                  this.controller.lights_map_ul[this.ps]  = this.id;

                  this.controller.data[this.ps] =
                      (255 << 24)      | // alpha
                      (this.b_c << 16) | // blue
                      (this.g_c <<  8) | // green
                       this.r_c;         // red
              }
            } else { //el rayo termina aca
              break;
            }

          }

        }
      }

  }

}
