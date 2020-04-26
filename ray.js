class Ray{
  constructor(p){
    this.controller = p.ctrl;
    this.light      = p.light;

    //d_y = opuesto d_x =adyacente d_v = hipotenusa
    //d_y = desplazamiento y d_x = desplazamiento x  game.loop.actualFps
    this.d_y = Math.sin(p.g*Math.PI/180);
    this.d_x = Math.cos(p.g*Math.PI/180);
    this.ps  = 0;
    this.px  = 0;
    this.py  = 0;

    this.t_d    = p.t_d;
    this.c_t_d  = 0;
    this.b_mult = p.b_mult;

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

    this.k   = 0;
  }

  trace(){
    for(this.c_t_d = this.t_d; this.c_t_d < 255*this.b_mult; this.c_t_d++){
        this.px = this.d_x*this.c_t_d+this.light.p[0];
        this.py = this.d_y*this.c_t_d+this.light.p[1];

        this.ps = Math.round(this.py) * this.controller.m_width + Math.round(this.px);

        if(this.py > 0 && this.px > 0 && this.px < this.controller.m_width && this.py < this.controller.m_height){
          if(this.controller.lights_obs[this.ps] != 1  //los obstaculos no se iluminan
              ){
            if (this.controller.lights_map_ul[this.ps] != this.light.id){ //no se reewscribe un lugar por donde ya paso esta luz
                this.r_c_l = this.light.c[0];
                this.g_c_l = this.light.c[1];
                this.b_c_l = this.light.c[2];

                this.r_c_m = this.controller.lights_map_r[this.ps];
                this.g_c_m = this.controller.lights_map_g[this.ps];
                this.b_c_m = this.controller.lights_map_b[this.ps];

                this.k = 255-this.c_t_d/this.b_mult;
                this.r_c_l = this.r_c_l / (255/this.k);
                this.g_c_l = this.g_c_l / (255/this.k);
                this.b_c_l = this.b_c_l / (255/this.k);

                //suma de las luces
                this.r_c = ((1 - (1 - this.r_c_l / 255) * (1 - this.r_c_m / 255)) * 255) | 1;
                this.g_c = ((1 - (1 - this.g_c_l / 255) * (1 - this.g_c_m / 255)) * 255) | 1;
                this.b_c = ((1 - (1 - this.b_c_l / 255) * (1 - this.b_c_m / 255)) * 255) | 1;

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
