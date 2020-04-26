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

    this.canvasTexture = null;
    this.context       = null;
    this.imageData     = null;

    this.buf           = null;
    this.buf8          = null;
    this.data          = null;
  }

  addLight(c){
    //se recalculan las coordenadas e acuerdo a la escala
    c.p[0] = c.p[0]/this.scale;
    c.p[1] = c.p[1]/this.scale;

    //se agrega la luz
    this.light_count ++;
    this.lights[this.light_count] = new PuntualLight(c, this, this.light_count);

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
    this.lights_map_ul = new Uint8Array(this.pixel_count);

    this.lights_obs    = new Uint8Array(this.pixel_count);

    this.canvasTexture = this.game.textures.createCanvas('LIGHT_MAP_TEXTURE', this.m_width, this.m_height, true);
    this.context       = this.canvasTexture.context;
    this.imageData     = this.context.getImageData(0, 0, this.m_width, this.m_height);

    this.buf           = new ArrayBuffer(this.imageData.data.length);
    this.buf8          = new Uint8ClampedArray(this.buf);
    this.data          = new Uint32Array(this.buf);

    this.game.add.image(0, 0, 'LIGHT_MAP_TEXTURE').setOrigin(0).setScale(this.scale).setBlendMode(Phaser.BlendModes.MULTIPLY);

  }

  update(){
    this.frame_count ++;
    if (this.frame_count > this.frame_skip){
      this.iteration_c   = 0;
      this.frame_count   = 0;

      //reseteo de mapa de luces
      let c=0;
      for (c=0;c<this.pixel_count;c++){ this.data[c]=(255 << 24) | (0 << 16) | (0 <<  8) | 0; }
      for (c=0;c<this.pixel_count;c++){ this.lights_map_r[c]=0; }
      for (c=0;c<this.pixel_count;c++){ this.lights_map_g[c]=0; }
      for (c=0;c<this.pixel_count;c++){ this.lights_map_b[c]=0; }
      for (c=0;c<this.pixel_count;c++){ this.lights_map_ul[c]=0; }

      //se modelan las fuentes de luz
      for(let j=0; j<this.lights.length; j++){
        if (this.lights[j] !== undefined && this.lights[j].enabled){ this.lights[j].update();  }
      }

      this.imageData.data.set(this.buf8);
      this.context.putImageData(this.imageData, 0, 0);
      this.canvasTexture.refresh();
    }

  }

}
