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
    let px  = this.p[0]; //px inicial
    let py  = this.p[1]; // py inicial
    let e   = this.i;    // valor de brillo, que definira la opacidad

    for (let g=0; g < 360; g+= this.ray_step){ // se crean los "rayos de luz", es una fuente puntual
      //d_y = opuesto d_x =adyacente d_v = hipotenusa
      //d_y = desplazamiento y d_x = desplazamiento x  game.loop.actualFps
      let d_y, d_x, d_v = 0;
      d_v = 0.1;

      d_y = Math.sin(g)*d_v;
      d_x = Math.cos(g)*d_v;

      for(let brillo = 1; brillo < e*this.b_mult; brillo++){
          px=d_x*brillo+this.p[0];
          py=d_y*brillo+this.p[1];

          let p = Math.floor(py) * this.controller.m_width + Math.floor(px);

          if(py > 0 && px > 0 && px < this.controller.m_width && py < this.controller.m_height){
            if(this.controller.lights_obs[p] != 1  //los obstaculos no se iluminan
                ){
              if (this.controller.lights_map_ul[p] != this.id){ //no se reewscribe un lugar por donde ya paso esta luz

                  let o_m = this.controller.lights_map_o[p];
                  let o_l = brillo/this.b_mult;
                  let o = (o_m + o_l)/2;

                  let r_c_l = this.c[0];
                  let g_c_l = this.c[1];
                  let b_c_l = this.c[2];

                  let r_c_m = this.controller.lights_map_r[p];
                  let g_c_m = this.controller.lights_map_g[p];
                  let b_c_m = this.controller.lights_map_b[p];

                  //suma de las luces
                  let r_c = Math.round((1 - (1 - r_c_l / 255) * (1 - r_c_m / 255)) * 255);
                  let g_c = Math.round((1 - (1 - g_c_l / 255) * (1 - g_c_m / 255)) * 255);
                  let b_c = Math.round((1 - (1 - b_c_l / 255) * (1 - b_c_m / 255)) * 255);

                  //transicion a negro de acuerdo a la luminosidad
                  r_c = r_c - ((r_c_l/255)*o);
                  g_c = g_c - ((g_c_l/255)*o);
                  b_c = b_c - ((b_c_l/255)*o);

                  this.controller.lights_map_r[p]  = r_c;
                  this.controller.lights_map_g[p]  = g_c;
                  this.controller.lights_map_b[p]  = b_c;
                  this.controller.lights_map_o[p]  = o;
                  this.controller.lights_map_ul[p] = this.id;
              }
            } else { //el rayo termina aca
              break;
            }

          }

        }
      }

  }

}
