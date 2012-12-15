ig.module('game.entities.horizontalwall').requires('impact.entity', 'game.entities.particle').defines(function ()
{
    EntityHorizontalwall = ig.Entity.extend(
    {
        
        size: {
            x: 36,
            y: 16
        },
        offset: {
            x: 0,
            y: 0
        },
        maxVel: {
            x: 30,
            y: 0
        },
        minVel: {
	        x:20,
	        y:0
        },
        seenPlayer: false,
        gravityFactor:0,
        bounciness:1,
        movingLeft:false,
        movingRight:false,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.ACTIVE,
        //moveTimer: null,
        health: 10000000,
        sfxGib: new ig.Sound('media/sounds/wetgib.ogg'),
        animSheet: new ig.AnimationSheet('media/sprites/bricks.png', 34, 16),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            //this.moveTimer = new ig.Timer();
            this.addAnim('idle', 0.5, [0]);
            this.vel.x = -15;
      
        },
        update: function ()
        {
     
        var xdist = Math.abs(ig.game.player.pos.x - this.pos.x);
        var ydist = Math.abs(ig.game.player.pos.y	- this.pos.y);
        var xpos=ig.game.player.pos.x; //ig.game.player.pos.x 
        var xdir = xpos - this.pos.x < 0 ? -1 : 1;
        if (!this.seenPlayer)
        {
            if (xdist < 164 && ydist < 164)
            {
                this.seenPlayer = true;
             
            } else {
                this.seenPlayer=false;
            }
        }
        
        if(this.seenPlayer)
        {
        
        
      
        var wall;
        var speed=15;
        var len=ig.game.getEntitiesByType( EntityHorizontalwall ).length;
	    for(var i=0; i<len; i++) {
	    
        wall = ig.game.getEntitiesByType( EntityHorizontalwall )[i];
        //console.log(wall.vel.x);
        if(wall.vel.x>0){
	        wall.movingLeft=true;
	   	}
	   	if(wall.vel.x<0){
	        wall.movingRight=true;
	   	}
	   	
        
        if(wall.vel.x==0 && wall.movingRight){
	     wall.movingRight=false;
	     wall.movingLeft=true;    
         wall.vel.x=speed;
        }
        
        if(wall.vel.x==0 && wall.movingLeft){
	     wall.movingLeft=false;
	     wall.movingRight=true;    
         wall.vel.x=-speed;
        }
        }
	     	
        }
        
        
         this.parent();
        },
        /*
        
        handleMovementTrace: function( res ) {
        if( res.collision.x){
        console.log(ig.game.getEntitiesByType( EntityHorizontalwall ).length);
	        var wall = ig.game.getEntitiesByType( EntityHorizontalwall )[0];
        	if(wall.vel.x<0) wall.vel.x=-26;
	        else wall.vel.x=26;
	   
	        //console.log(wall.vel.x);
	    }
	    this.parent(res);
        },
        */
        check: function (other)
        {
            other.receiveDamage(100, this);
        }
    });
    EntityBlobGib = EntityParticle.extend(
    {
        lifetime: 3,
        fadetime: 6,
        friction: {
            x: 0,
            y: 0
        },
        vel: {
            x: 60,
            y: 150
        },
        animSheet: new ig.AnimationSheet('media/sprites/blob-gibs.png', 4, 4),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 0.1, [0, 1, 2]);
            this.parent(x, y, settings);
        }
    });
});