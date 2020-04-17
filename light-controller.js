class LightsController {
  constructor(config){
    this.config        = config;
    this.game          = this.config.game;
    this.lights        = [];
    this.light_count   = 0;
    this.iteration_c   = 0;
    this.frame_count   = 0;

    this.screen_w    = this.config.screen_w;
    this.screen_h    = this.config.screen_h;
    this.scale       = this.config.scale;
    this.frame_skip  = this.config.update_frame_skip;

    this.m_width     = this.screen_w / this.scale;
    this.m_height    = this.screen_h / this.scale;
    this.pixel_count = this.screen_w * this.screen_h;

    this.canvasTexture = this.game.textures.createCanvas('LIGHT_MAP_TEXTURE', this.m_width, this.m_height);
    let c              = this.canvasTexture.getSourceImage();
    this.context       = c.getContext('2d');
    this.imageData     = this.context.getImageData(0, 0, this.m_width, this.m_height);

    this.buf           = new ArrayBuffer(this.imageData.data.length);
    this.buf8          = new Uint8ClampedArray(this.buf);
    this.data          = new Uint32Array(this.buf);
  }

  addLight(c){
    //se recalculan las coordenadas e acuerdo a la escala
    c.p[0] = c.p[0]/this.scale;
    c.p[1] = c.p[1]/this.scale;

    //se agrega la luz
    this.light_count ++;
    this.lights[this.light_count] = new Light(c, this, this.light_count);

    return this.light_count;
  }

  setLightPosition(id,x,y){
    x = x/this.scale;
    y = y/this.scale;
    this.lights[id].setPosition(x,y);
  }

  setLightEnabled(id,e){
    this.lights[id].setEnabled(e);
  }

  setObsPixel(x,y,v){
    x = x/this.scale;
    y = y/this.scale;
    this.lights_obs[y * this.m_width + x] = v;
  }

  create(game){
    this.game          = game;
    this.lights_map_r  = new Uint8Array(this.pixel_count);
    this.lights_map_g  = new Uint8Array(this.pixel_count);
    this.lights_map_b  = new Uint8Array(this.pixel_count);
    this.lights_map_o  = new Uint8Array(this.pixel_count);
    this.lights_map_ul = new Uint8Array(this.pixel_count);

    this.lights_obs    = new Uint8Array(this.pixel_count);

    this.game.add.image(0, 0, 'LIGHT_MAP_TEXTURE').setOrigin(0).setScale(this.scale);
  }

  update(){
    this.frame_count ++;

    if (this.frame_count > this.frame_skip){
      this.iteration_c   = 0;
      this.frame_count   = 0;

      //reseteo de imagen
      for (let y = 0; y < this.m_height; ++y) {
          for (let x = 0; x < this.m_width; ++x) {
              this.data[y * this.m_width + x] = 0;
          }
      }

      //reseteo de mapa de luces
      this.lights_map_r  = new Uint8Array(this.pixel_count);
      this.lights_map_g  = new Uint8Array(this.pixel_count);
      this.lights_map_b  = new Uint8Array(this.pixel_count);
      this.lights_map_o  = new Uint8Array(this.pixel_count).fill(255);
      this.lights_map_ul = new Uint8Array(this.pixel_count);

      //se modelan las fuentes de luz
      for(let j=0; j<this.lights.length; j++){
        //se comprueba si esta activa
        if (this.lights[j] !== undefined && this.lights[j].enabled){ this.lights[j].update();  }
      }

      //se actualiza la textura de luces
      for (let y = 0; y < this.m_height; ++y) {
          for (let x = 0; x < this.m_width; ++x) {
              let p = y * this.m_width + x;
              this.data[p] =
                  (this.lights_map_o[p] << 24) | // alpha
                  (this.lights_map_b[p] << 16) | // blue
                  (this.lights_map_g[p] <<  8) | // green
                   this.lights_map_r[p];         // red

          }
      }

      this.imageData.data.set(this.buf8);
      this.context.putImageData(this.imageData, 0, 0);
    }

  }

}
