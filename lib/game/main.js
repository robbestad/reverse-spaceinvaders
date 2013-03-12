/*
REVERSE SPACE INVADERS

License
The game code for this game is released under non-commercial BSD (http://opensource.org/licenses/BSD-3-Clause), which means you're free to fork it, develop and release new versions for non-commercial use. I reserve the commercial use of this game, which means that if any commercial entity wants to put up this game on their portal, they must acquire a commercial license from me. The game uses ImpactJS, which has a separate license. To run and compile this game, you need the impactjs game engine (which should be placed under lib/).

The game is written by:
Sven Anders Robbestad, Professional web developer working at SOL.no, amateur game developer on the side

*/

ig.module( 
    'game.main' 
)
.requires(
    'impact.game',
    'impact.font',
    'impact.sound',
    'game.entities.trigger',
    'game.entities.stars',
    'game.entities.levelcomplete',
    'game.levels.menu',

// LEVEL 1 AND BONUS
    'game.levels.level1',
   
    'game.camera',
    'impact.collision-map', 
    'impact.background-map', 
    //'plugins.perpixel',
    'game.math',
    'game.entities.impactcam',
    'plugins.svenardo-loader',
    'plugins.impact-storage',
    'plugins.webgl-2d'
   // ,'impact.debug.debug'

)
.defines(function(){

MyGame = ig.Game.extend({
    
    gravity: 0, // All entities are affected by this
    
    // Load a font
    
    font: new ig.Font( 'media/arialwhte.png' ),
        clearColor: '#0d0c0b',
        player: null,
        autoSort: true,
        sortBy: ig.Game.SORT.POS_Y,
        mode: 0,
        storage: new ig.Storage(),
        lastCheckpoint: null,
        playerSpawnPos: {
            x: 0,
            y: 0
        },
        map: [],

        // important game counters
        deathCount: 0,
        opponentLives: 1,
        livesLeft: 3,
        crystalCount: 0,
        laserLeft:1500,
        globalSpeed:100,
        debug:false,
        lastYvel:0,
        init_starfield:true,
        
        // level vars
        nextLevel: 1,
        nextLevelX: 0,
        OutputText: false,
                                 
        nextLevelY: 0,
        
        score:0,
        levelTime: null,
        levelTimeText: '0',
        musicIntro: new ig.Sound('media/music/loop128.*'),
        font: new ig.Font('media/arialwhte.png'),
        camera: null,
        lastTick: 0.016,
        realTime: 0,
        showFPS: false,


    init: function() {
            this.storage = new ig.Storage();
            this.storage.initUnset('rsihighScore', 0); 
            this.camera = new Camera(ig.system.width / 10.5, ig.system.height / 10, 5);
            this.camera.trap.size.x = ig.system.width / 1;
            this.camera.trap.size.y = ig.system.height / 1;
            this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width / 1 : 0;
            this.camera.lookAhead.y = ig.ua.mobile ? ig.system.height / 10 : 0;
          
            ig.music.volume = 1;
            ig.music.add(this.musicIntro);
            ig.music.play();

            // INITIAL LEVEL:
            this.loadLevel(LevelLevel1,0,0,5); 
              
            this.realTime = Date.now();
            this.lastTick = 0.016;
            this.score=0;
            // Bind keys
            ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
            ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
            ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
        
        
        
        ig.input.bind( ig.KEY.Z, 'dropdynamite' );
        //ig.input.bind( ig.KEY.X, 'jump' );
        ig.input.bind( ig.KEY.UP_ARROW, 'up' );
        ig.input.bind( ig.KEY.C, 'shoot' );
        
        if( ig.ua.mobile ) {
            ig.input.bindTouch( '#buttonLeft', 'left' );
            ig.input.bindTouch( '#buttonRight', 'right' );
            ig.input.bindTouch( '#buttonShoot', 'shoot' );
            //ig.input.bindTouch( '#buttonJump', 'jump' );
            ig.input.bindTouch( '#buttonJump', 'up' );
        }
               
    
    },
    

        loadLevel: function (level,xpos,ypos)
        {
              //console.log(extrainfo);
            this.OutputText=false;
            if (ig.ua.iPhone4 || ig.ua.android)
            {
                for (var i = 0; i < level.layer.length; i++)
                {
                    if (level.layer[i].name == 'background')
                    {
                        level.layer.erase(level.layer[i]);
                    }
                }
            }
            this.parent(level);
            this.player = this.getEntitiesByType(EntityPlayer)[0];
            this.lastCheckpoint = null;
            
            if(null!=xpos && "undefined"!=xpos && xpos>0){
                this.player.pos.x=xpos;
            }
            if(null!=ypos && "undefined"!=ypos && ypos>0){
                this.player.pos.y=ypos;
            }

            this.playerSpawnPos = {
                x: this.player.pos.x,
                y: this.player.pos.y
            };
            this.levelTime = new ig.Timer();
            this.mode = MyGame.MODE.GAME;
            //Don't need camera when using fixed size screen - 15.12.2012
            //this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
            //this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
            //this.camera.set(this.player);
            if (ig.ua.mobile)
            {
                for (var i = 0; i < this.backgroundMaps.length; i++)
                {
                    this.backgroundMaps[i].preRender = true;
                }
            }

        },
        endLevel: function (nextLevel,xpos,ypos,extrainfo)
        {
            this.nextLevel = nextLevel;
            ig.game.nextLevel = nextLevel;
            this.levelTimeText = this.levelTime.delta().round(2).toString();
            this.loadLevel(ig.game.nextLevel,xpos,ypos,extrainfo);
        },
        win: function ()
        {
            //console.log(this.score)
            this.storage.setHighest('rsihighScore',this.score); 

            ig.system.setGame(GameWin);
        },
        end: function ()
        {
            ig.system.setGame(GameCredits);
        },
        respawnPlayerAtLastCheckpoint: function (x, y)
        {
            var pos = this.playerSpawnPos;
            if (this.lastCheckpoint)
            {
                pos = this.lastCheckpoint.getSpawnPos()
                this.lastCheckpoint.currentAnim = this.lastCheckpoint.anims.respawn.rewind();
            }
            this.player = this.spawnEntity(EntityPlayer, pos.x-8, pos.y-8);
            this.player.currentAnim = this.player.anims.spawn;
            this.deathCount++;
            if(this.livesLeft>0)
                this.livesLeft--;
        },


    update: function() {        
        ig.game.globalSpeed+=0.01
        var player = this.getEntitiesByType( EntityPlayer )[0];
        if( player ) {
            if (ig.ua.iPad)
            {
                this.screen.x = this.player.pos.x - ig.system.width/2;
                this.screen.y = this.player.pos.y - ig.system.height/2;
            }
            else if (ig.ua.iPhone4)
            {
                this.screen.x = this.player.pos.x - ig.system.width/2;
                this.screen.y = this.player.pos.y - ig.system.height/2;        
            }
            else if (ig.ua.mobile)
            {
                this.screen.x = this.player.pos.x - ig.system.width/2;
                this.screen.y = this.player.pos.y - ig.system.height/2;
            }
            else
            {
            this.camera.follow(this.player);
            }

        }
        
        this.storage.setHighest('rsihighScore',this.score); 
        

        //lovely stars
        if(ig.game.init_starfield){
            for(i=0;i<100;i++){
            ig.game.spawnEntity(EntityStars, (Math.random() < 0.5 ? 1 : 2)*Math.random()*500, (Math.random() < 0.5 ? 1 : 2)*Math.random()*500, {});
            ig.game.init_starfield=false
            }
        }
        if(ig.game.getEntitiesByType(EntityStars).length<100){
        ig.game.spawnEntity(EntityStars, (Math.random() < 0.5 ? 1 : 2)*Math.random()*500, 650, {});

         for(i=0;i<ig.game.getEntitiesByType(EntityStars).length;i++){
                ig.game.getEntitiesByType(EntityStars)[i].accel.y-=200
            }
        }


        //Finally, DRAW
        this.parent();
    },

    draw: function() {
        // Draw all entities and BackgroundMaps
         var maxX = ig.game.collisionMap.width * ig.game.collisionMap.tilesize;
        this.parent();
        if( !ig.ua.mobile ) {
             this.font.draw( 'SCORE: '+ig.game.score+"   LIVES: "+ig.game.livesLeft, 2, 2 );
            this.font.draw('HIGHSCORE: '+this.storage.getInt('rsihighScore'),(maxX/2),2);
            var percent=Math.ceil((ig.game.getEntitiesByType(EntityShip)[0].health/ig.game.getEntitiesByType(EntityShip)[0].starthealth)*100)
            this.font.draw('ENEMY: '+percent+"%",maxX-10,2);
        }  


        if(ig.game.debug){
            /*
            this.font.draw( 'X: '+this.player.pos.x,2,30)
            this.font.draw( 'Y: '+this.player.pos.y,2,50)
            this.font.draw( 'vel X: '+this.player.vel.x,2,70)
            this.font.draw( 'vel Y: '+this.player.vel.y,2,90)
           
            this.font.draw( 'vel.X: '+this.player.accel.x,3,110)
            this.font.draw( 'vel.Y: '+this.player.accel.y,3,130)
            */
    
        }
     
        this.lastYvel=this.player.vel.y;

        if(this.OutputText){
         this.font.draw( this.OutputText, 50,50 );
        this.OutputText=false;  
        }

    }
});


// A Custom Loader for the game, that, after all images have been
// loaded, goes through them and "pixifies" them to create the LCD
// effect.
SimpleLoader = ig.Loader.extend({
    
    draw: function() {
   /*     this.font.draw('You are part of an intergalactic alien force determined', 444, 445, ig.Font.ALIGN.CENTER);

        this.font.draw('to invade earth and take control of the water! Destroy', 444, 465, ig.Font.ALIGN.CENTER);

        this.font.draw('the human plague once and for all!', 444, 485, ig.Font.ALIGN.CENTER);

        this.font.draw('Use [ARROW] keys to move, [SPACEBAR] to shoot', 444, 585, ig.Font.ALIGN.CENTER);

        this.font.draw('HIGHSCORE: '+this.storage.getInt('rsihighScore'),440,20,ig.Font.ALIGN.CENTER);

*/
        // This one clears the screen and draws the 
        // percentage loaded as text
        var w = ig.system.realWidth;
        var h = ig.system.realHeight;
        ig.system.context.fillStyle = '#000000';
        ig.system.context.fillRect( 0, 0, w, h );

        var percentage = (this.status * 100).round() + '%';
        ig.system.context.fillStyle = '#ffffff';
        ig.system.context.fillText( percentage, w/2,  h/2 );
    }
     
    
   
     
});


 MyGame.MODE = {
        GAME: 1,
        STATS: 2
    };
    GameTitle = ig.Class.extend(
    {
        introTimer: null,
        noise: null,
        //clearColor: null,
        clearColor: '#0d0c0b',
        
        sound: new ig.Sound('media/music/soundtrack128.*'),
        biglogo: new ig.Image('media/logo.png'),
     //   player: new ig.Image('media/title-player.gif'),
        font: new ig.Font('media/arialwhte.png'),
        init: function ()
        {
           
            if (!GameTitle.initialized)
            {
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.UP_ARROW, 'jump');
                ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
                ig.input.bind(ig.KEY.Z, 'dropdynamite' );
        
                
                ig.input.bind(ig.KEY.C, 'shoot');
                ig.input.bind(ig.KEY.SPACE, 'shoot');
                ig.input.bind(ig.KEY.F, 'fps');
                if (ig.ua.mobile)
                {
                    ig.input.bindTouch('#buttonFPS', 'fps');
                    ig.input.bindTouch('#buttonLeft', 'left');
                    ig.input.bindTouch('#buttonRight', 'right');
                    ig.input.bindTouch('#buttonShoot', 'shoot');
                    ig.input.bindTouch('#buttonJump', 'jetpack');
                }
                GameTitle.initialized = true;
            }
            this.introTimer = new ig.Timer(1);
        },
        /*
        update: function(){
        //lovely stars
        if(ig.game.init_starfield){
            for(i=0;i<100;i++){
            ig.game.spawnEntity(EntityStars, (Math.random() < 0.5 ? 1 : 2)*Math.random()*500, (Math.random() < 0.5 ? 1 : 2)*Math.random()*500, {});
            ig.game.init_starfield=false
            }
        }
        if(ig.game.getEntitiesByType(EntityStars).length<100){
        ig.game.spawnEntity(EntityStars, (Math.random() < 0.5 ? 1 : 2)*Math.random()*500, -1, {});

         for(i=0;i<ig.game.getEntitiesByType(EntityStars).length;i++){
                ig.game.getEntitiesByType(EntityStars)[i].accel.y+=200
            }
        }
        this.parent();
        
        },
        */
        
        run: function ()
        {
            if (ig.input.pressed('shoot') || ig.input.pressed('jump'))
            {
                this.sound.stop();
           
                ig.system.setGame(MyGame);
                return;
            }
            var d = this.introTimer.delta();
            if (!this.soundPlayed && d > -0.3)
            {
                this.soundPlayed = true;
                this.sound.play();
            }
            if (ig.ua.mobile)
            {
                ig.system.clear('#0d0c0b');
                this.biglogo.draw((d * d * -d).limit(0, 1).map(1, 0, -160, 12), 6);
                this.disaster.draw((d * d * -d).limit(0, 1).map(1, 0, 300, 12), 46);
                this.player.draw((d * d * -d).limit(0, 1).map(0.5, 0, 240, 70), 56);
                if (d > 0 && (d % 1 < 0.5 || d > 2))
                {
                    this.font.draw('Press Button to Play', 80, 140, ig.Font.ALIGN.CENTER);
                }
            }
            else
            {
                ig.system.clear('#0d0c0b');

                this.storage = new ig.Storage();
                this.storage.initUnset('rsihighScore', 0);
                this.biglogo.draw((d * d * -d).limit(0, 1).map(1, 0, 34, 135), 126);
               // this.player.draw((d * d * -d).limit(0, 1).map(0.5, 0, 240, 166), 256);
                if (d > 0 && (d % 1 < 0.5 || d > 2))
                {
                    this.font.draw('Press SPACEBAR to Play', 444, 355, ig.Font.ALIGN.CENTER);
                }
               
                this.font.draw('You are part of an intergalactic alien force determined', 444, 445, ig.Font.ALIGN.CENTER);
               
                this.font.draw('to invade earth and take control of the water! Destroy', 444, 465, ig.Font.ALIGN.CENTER);
               
                this.font.draw('the human plague once and for all!', 444, 485, ig.Font.ALIGN.CENTER);
               
                this.font.draw('Use [ARROW] keys to move, [SPACEBAR] to shoot', 444, 585, ig.Font.ALIGN.CENTER);
               
                this.font.draw('HIGHSCORE: '+this.storage.getInt('rsihighScore'),440,20,ig.Font.ALIGN.CENTER);
    
            }


            
            
        },
        draw: function(){
            this.parent();
        
        }
    });
    GameTitle.initialized = false;
    GameWin =  ig.Class.extend(
    {
        introTimer: null,
        font: new ig.Font('media/arialwhte.png'),
        lineHeight: 24,
        scroll: 0,
        scrollSpeed: 25,
        
        credits: ['      YOU WON! Earth is yours!', '', '',
        '         GAME OVER', '', '', 
        '     Thanks for Playing!', '', '', 
        'Concept, Graphics, SFX & Programming', '    Sven Anders Robbestad', '', 
        'Graphics', '    Sven Anders Robbestad', 
                    '    ',
                    '    ', 
                    '          INSERT COIN!', 
        '', '', '', '', '', ''],

        init: function ()
        {
            this.timer = new ig.Timer();
        },
        run: function ()
        {
            var d = this.timer.delta();
            var color = Math.round(d.map(0, 3, 255, 0)).limit(0, 255);
            ig.system.clear('rgb(' + color + ',' + color + ',' + color + ')');
            if ((d > 3 && ig.input.pressed('shoot') || ig.input.pressed('jump')) || (ig.system.height - this.scroll + (this.credits.length + 2) * this.lineHeight < 0))
            {
                ig.system.setGame(GameTitle);
                return;
            }
            var mv = ig.ua.mobile ? 0 : 32;
            if (d > 4)
            {
                this.scroll += ig.system.tick * this.scrollSpeed;
                for (var i = 0; i < this.credits.length; i++)
                {
                    var y = ig.system.height - this.scroll + i * this.lineHeight;
                    this.font.draw(this.credits[i], mv, y);
                }
            }
        }
    });


    GameCredits = ig.Class.extend(
    {
        introTimer: null,
        font: new ig.Font('media/arialwhte.png'),
        lineHeight: 24,
        scroll: 0,
        scrollSpeed: 25,
         credits: ['         GAME OVER', '', '', 
        '     Thanks for Playing!', '', '', 
        'Concept, Graphics, SFX & Programming', '    Sven Anders Robbestad', '', 
        'Graphics', '    Sven Anders Robbestad', 
                    '    ',
                    '    ', 
                    '                INSERT COIN!', 
        '', '', '', '', '', ''],
        init: function ()
        {
            this.timer = new ig.Timer();
        },
        run: function ()
        {
            var d = this.timer.delta();
            var color = Math.round(d.map(0, 3, 255, 0)).limit(0, 255);
            ig.system.clear('rgb(' + color + ',' + color + ',' + color + ')');
            if ((d > 3 && ig.input.pressed('shoot') || ig.input.pressed('jump')) || (ig.system.height - this.scroll + (this.credits.length + 2) * this.lineHeight < 0))
            {
                ig.system.setGame(GameTitle);
                return;
            }
            var mv = ig.ua.mobile ? 0 : 332;
            if (d > 4)
            {
                this.scroll += ig.system.tick * this.scrollSpeed;
                for (var i = 0; i < this.credits.length; i++)
                {
                    var y = ig.system.height - this.scroll + i * this.lineHeight;
                    this.font.draw(this.credits[i], mv, y);
                }
            }
        }
    });

  /*
if( ig.ua.iPad ) {
    ig.Sound.enabled = false;
    ig.main('#canvas', MyGame, 60, 240, 160, 2);
}
else if( ig.ua.mobile ) {   
    ig.Sound.enabled = false;
    var width = 320;
    var height = 320;
    ig.main('#canvas', MyGame, 60, 160, 160, 1);
    
    var c = ig.$('#canvas');
    c.width = width;
    c.height = height;
    
    var pr = 2;//ig.ua.pixelRatio;
    if( pr != 1 ) {
        c.style.webkitTransformOrigin = 'left top';
        c.style.webkitTransform = 
            'scale3d(2,2, 0)' +
            '';
    }
}
else {
    

    if (ig.ua.iPad)
        {
            ig.Sound.enabled = false;
            ig.main('#canvas', GameTitle, 60, 240, 160, 2, ig.ImpactSplashLoader);
        }
        else if (ig.ua.iPhone4)
        {
            ig.Sound.enabled = false;
            ig.main('#canvas', GameTitle, 60, 160, 160, 4, ig.ImpactSplashLoader);
        }
        else if (ig.ua.mobile)
        {
            ig.Sound.enabled = false;
            ig.main('#canvas', GameTitle, 60, 160, 160, 2, ig.ImpactSplashLoader);
        }
        else

        {
            ig.Sound.use = [ig.Sound.FORMAT.OGG, ig.Sound.FORMAT.MP3];
            ig.Sound.enabled = false;
            ig.main('#canvas', GameTitle, 60, 900, 650, 1, ig.ImpactSplashLoader);
        }
}
        */
   //     ig.Sound.use = [ig.Sound.FORMAT.MP3, ig.Sound.FORMAT.OGG];
        ig.Sound.enabled = true;
        ig.main('#canvas', GameTitle, 60, 900, 650, 1, SvenardoLoader);

    


});