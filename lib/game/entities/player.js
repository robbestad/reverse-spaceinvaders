ig.module('game.entities.player').requires('impact.entity', 'game.entities.particle').defines(function ()
{
    EntityPlayer = ig.Entity.extend(
    {
        size: {
            x: 254,
            y: 121
        },
        offset: {
            x: 0,
            y: 0
        },
        maxVel: {
            x: 1000,
            y: 450
        },
        accelDef: {
            ground: 100,
            air: 900
        },
        frictionDef: {
            ground: 500,
            air: 500
        },
        jump: 120,
        bounciness: 0,
        health: 10,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,
        flip: false,
        flippedAnimOffset: 0,
        idle: false,
        moved: false,
        duck: false,
        wasStanding: false,
        canHighJump: false,
        canJump: true,
        highJumpTimer: null,
        idleTimer: null,
        sfxLaser: new ig.Sound('media/sounds/laser3.*'),
        sfxDie: new ig.Sound('media/sounds/die-respawn.*', false),
        animSheet: new ig.AnimationSheet('media/vw/enemy_spaceship.png', 254, 121),
        init: function (x, y, settings)
        {
            //console.log(this.animSheet);
            this.friction.y = 0;
            if(null !== ig.game.lastYvel) this.vel.y=ig.game.lastYvel;
            
            this.parent(x, y, settings);
            this.idleTimer = new ig.Timer();
           // this.highJumpTimer = new ig.Timer();
            this.addAnim('idle', 1, [0]);
            this.addAnim('accelerate', 0.1, [0]);
            this.addAnim('fall', 1, [0]);
            this.addAnim('die', 0.07, [0]);
            this.addAnim('spawn', 0.07, [0]);
        },
		getCenterPos: function(){
		return [ this.pos.x + (this.size.x / 2), this.pos.y + (this.size.y / 2), 0 ];
		},
        update: function ()
        {

        	if(ig.game.levelNumber==0){
	        	this.currentAnim = this.anims.idle;
        	}
        
            if (this.currentAnim == this.anims.spawn)
            {
                this.currentAnim.update();
                if (this.currentAnim.loopCount)
                {
                    this.currentAnim = this.anims.idle.rewind();
                }
                else
                {
                    return;
                }
            }
            if (this.currentAnim == this.anims.die)
            {
                this.currentAnim.update();
                if (this.currentAnim.loopCount)
                {
                    this.kill();
                }
                return;
            }
            this.moved = false;
            this.friction.x = this.standing ? this.frictionDef.ground : this.frictionDef.air;
            
            if (ig.input.state('up')) {
                if(this.pos.y>=0 && this.pos.y<600){
                    this.vel.y -= 25
                    this.accel.y -=2
                    } 
                this.duck=false;
            } 
            

            if (ig.input.state('down'))
            {
                this.friction.y = this.standing ? this.frictionDef.ground : this.frictionDef.air;
                   if(this.pos.y<600){
                        this.vel.y += 25
                        this.accel.y += 2
                    } 
            }
            
            if (ig.input.state('left'))
            {
               // this.accel.x = -(this.standing ? this.accelDef.ground : this.accelDef.air);
                this.flip = true;
                this.duck=false;
                this.moved = true;
                this.currentAnim = this.anims.accelerate
                this.accel.x -= 4
                this.vel.x -=50;
                
            }
            
            if (ig.input.state('right'))
            {
                //this.accel.x = (this.standing ? this.accelDef.ground : this.accelDef.air);
                this.accel.x += 4
                this.vel.x +=50
                this.flip = false;
                this.duck=false;
                this.moved = true;
                this.currentAnim = this.anims.accelerate
            }
            
            
			
		
        if(this.vel.x==0){
            this.currentAnim = this.anims.idle
        }
            
        //Stabilizer
        if(this.pos.y<=0) {
        this.pos.y = 0;
        this.vel.y+=10
        }
        if(this.pos.y>=600) {
        this.pos.y = 600;
        this.vel.y=-10
        }
        if(this.pos.x<0){
            this.pos.x=10;
            this.vel.x=0;
            this.accel.x=0;
        }
        if(this.accel.x>0)  { this.accel.x -= 2; if(this.vel.x>50) this.vel.x -=20; }
        if(this.accel.y>0)  { this.accel.y -= 2; if(this.vel.y>50) this.vel.y +=20; }
        if(this.accel.x<-0) { this.accel.x += 2; if(this.vel.x<50) this.vel.x +=20; }
        if(this.accel.y<-0) { this.accel.y += 2; if(this.vel.y<50) this.vel.y -=20; }

        if(this.pos.x>47900){
            this.pos.x=47900;
            this.vel.x=0;
            this.accel.x=0;
        }
            
                        
            if (ig.input.pressed('shoot'))
            {
                this.sfxLaser.play();
            
            if(ig.game.laserLeft>0){
                
                var x = this.pos.x + (this.flip ? -3 : 5);
                var y = this.pos.y + 6;
                ig.game.laserLeft-=1;

                ig.game.spawnEntity(EntityProjectile, x, y, {
                    flip: this.flip
                });
            }
            }
           
            this.wasStanding = this.standing;
            this.parent();
            this.setAnimation();
        },
        setAnimation: function ()
        {
            if ((!this.wasStanding && this.standing))
            {
               // this.currentAnim = this.anims.land.rewind();
            }
            else if (this.standing && (this.currentAnim != this.anims.land || this.currentAnim.loopCount > 0))
            {
                if (this.moved)
                {
                   
                    this.idle = false;
                }
                else
                {
                    if (!this.idle || this.currentAnim.stop && this.currentAnim.loopCount > 0)
                    {
                        this.idle = true;
                        this.idleTimer.set(Math.random() * 4 + 3);
                        this.currentAnim = this.anims.idle;
                    }
                    if (this.idleTimer.delta() > 0)
                    {
                        this.duck=false;
                        this.idleTimer.reset();
                    }
                }
            }
            else if (!this.standing)
            {
                if (this.vel.y < 0)
                {
                    //this.currentAnim = this.anims.jump;
                   
                }
                this.idle = false;
            }
            this.currentAnim.flip.x = this.flip;
            if (this.flip)
            {
                this.currentAnim.tile += this.flippedAnimOffset;
            }
        },
        collideWith: function (other, axis)
        {
            if (axis == 'y' && this.standing && this.currentAnim != this.anims.die)
            {
                this.currentAnim.update();
                this.setAnimation();
            }
        },
        receiveDamage: function (amount, from)
        {

            if (this.currentAnim != this.anims.die)
            {
                this.currentAnim = this.anims.die.rewind();
                for (var i = 0; i < 4; i++)
                {
                    ig.game.spawnEntity(EntityPlayerGib, this.pos.x, this.pos.y);
                }
                //ig.game.spawnEntity(EntityPlayerGibGun, this.pos.x, this.pos.y);



                this.sfxDie.play();
            }
        },
        kill: function ()
        {
            this.parent();
            if(ig.game.livesLeft==0){
            	ig.game.end();
           	    ig.music.fadeOut(4);
            
            	}
            else {
                ig.game.lastYvel=0;
            	ig.game.respawnPlayerAtLastCheckpoint(this.pos.x, this.pos.y);
            }
        }
    });
    EntityPlayerGib = EntityParticle.extend(
    {
        lifetime: 0.8,
        fadetime: 0.4,
        friction: {
            x: 0,
            y: 0
        },
        vel: {
            x: 30,
            y: 80
        },
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet('media/sprites/player.png', 8, 8),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 7, [82, 94]);
            this.parent(x, y, settings);
        }
    });
    EntityPlayerGibGun = EntityParticle.extend(
    {
        lifetime: 2,
        fadetime: 0.4,
        size: {
            x: 8,
            y: 8
        },
        friction: {
            x: 30,
            y: 0
        },
        vel: {
            x: 60,
            y: 50
        },
        animSheet: new ig.AnimationSheet('media/sprites/player.png', 8, 8),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 0.5, [11]);
            this.parent(x, y, settings);
            this.currentAnim.flip.y = false;
        }

    });
    EntityProjectile = ig.Entity.extend(
    {
        size: {
            x: 20,
            y: 8
        },
        offset: {
            x: -155,
            y: -66
        },
        maxVel: {
            x: 2000,
            y: 0
        },
        gravityFactor: 0,
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.NEVER,
        flip: false,
        hasHit: false,
        lifetime: 0.4,
        animSheet: new ig.AnimationSheet('media/sprites/projectile.png', 20, 8),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.offset.x = (settings.flip ? -75 : this.offset.x);
            this.addAnim('idle', 1, [0]);
            this.addAnim('hit', 0.1, [0], true);
            this.idleTimer = new ig.Timer();
        },
        update: function ()
        {
            
            if (this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }

            if (this.hasHit && this.currentAnim.loopCount > 0)
            {
                this.kill();
            }
            this.parent();
            this.currentAnim.flip.x = this.flip;
        },
        handleMovementTrace: function (res)
        {
            this.parent(res);
            if (res.collision.x || res.collision.y)
            {
                this.currentAnim = this.anims.hit;
                this.hasHit = true;
            }
        },
        check: function (other)
        {
            if (!this.hasHit)
            {
            
                other.receiveDamage(10, this);
                this.hasHit = true;
                this.currentAnim = this.anims.hit;
                this.vel.x = 0;
                
            }
        }
        });
                   
    EntityExplosion = ig.Entity.extend(
        {
        size: {
            x: 48,
            y: 48
        },
        offset: {
            x: 12,
            y: 24
        },
        
        duration: 10,
        strength: 8,
        
        sound: new ig.Sound('media/sounds/explode.*', false),
        quakeTimer: null,
        
        bounciness: 0,
        gravityFactor: 0,
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.NONE,
        flip: false,
        animSheet: new ig.AnimationSheet('media/sprites/explosion.png', 48, 48),
        init: function (x, y, settings)
        {
            this.addAnim('drop', 0.1, [1, 1,2,3,4,5,6,7], true);
            this.currentAnim = this.anims.drop;
            this.quakeTimer = new ig.Timer();
            this.parent(x, y, settings);
            this.quakeTimer.set(this.duration);
	         
            if (this.sound)
            {
                this.sound.play();
            }
        },
        update: function ()
        {
                
            if (this.currentAnim.loopCount > 0)
            {
	            this.kill();
                
            }

           
             var delta = this.quakeTimer.delta();
   
	        if (delta < -1)
            {
                var s = this.strength * Math.pow(-delta / this.duration, 2);
                if (s > 0.5)
                {
                    ig.game.screen.x += Math.random().map(0, 1, -s, s);
                    ig.game.screen.y += Math.random().map(0, 1, -s, s);
                }
            }  
             this.parent();
             this.currentAnim.flip.x = this.flip;
        },
        check: function (other)
        {
                other.receiveDamage(1500, this);
            
        }        
        
    });
    
    
        EntityDynamite = ig.Entity.extend(
        {
        size: {
            x: 8,
            y: 8
        },
        offset: {
            x: 0,
            y: 0
        },
        maxVel: {
            x: 0,
            y: 40
        },
        bounciness: 0,
        gravityFactor: 5,
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,
        flip: false,
        hasHit: false,
        animSheet: new ig.AnimationSheet('media/sprites/dynamite.png', 8, 8),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim('drop', 0.2, [1,2,3,4,5], true);
            this.currentAnim = this.anims.drop;
                
        },
        update: function ()
        {
         
            if (this.currentAnim.loopCount > 0)
            {
                this.kill();
                ig.game.spawnEntity(EntityExplosion, this.pos.x, this.pos.y);
            }
            
            this.parent();
            
        },
        
    });
   

  
   
    
});
