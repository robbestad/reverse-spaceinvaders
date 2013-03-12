ig.module('game.entities.player').requires('impact.entity').defines(function ()
{
    EntityPlayer = ig.Entity.extend(
    {
        size: {
            x: 104,
            y: 38
        },
        _size: {
            x: 104,
            y: 38
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
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.LITE,
        flip: false,
        flippedAnimOffset: 0,
        idle: false,
        moved: false,
        duck: false,
        laserTimer: null,
        wasStanding: false,
        canHighJump: false,
        canJump: true,
        highJumpTimer: null,
        idleTimer: null,
        sfxLaser: new ig.Sound('media/sounds/shoot1.*'),
        sfxDie: new ig.Sound('media/sounds/hurt1.*'),
        animSheet: new ig.AnimationSheet('media/alien.png', 104, 38),
        init: function (x, y, settings)
        {
            //console.log(this.animSheet);
            this.friction.y = 0;
            if(null !== ig.game.lastYvel) this.vel.y=ig.game.lastYvel;
            this.parent(x, y, settings);
            this.idleTimer = new ig.Timer();
            this.laserTimer = new ig.Timer();
            this.addAnim('idle', 1, [3]);
            this.addAnim('accelerate', 0.1, [3]);
            this.addAnim('fall', 1, [3]);
            this.addAnim('die', 0.07, [4]);
            this.addAnim('spawn', 0.07, [3]);
        },
        getCenterPos: function(){
        return [ this.pos.x + (this.size.x / 2), this.pos.y + (this.size.y / 2), 0 ];
        },
        update: function ()
        {

            var maxX = ig.game.collisionMap.width * ig.game.collisionMap.tilesize;
            var maxY = ig.game.collisionMap.height * ig.game.collisionMap.tilesize;
        
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
                if(this.pos.y>0 && this.pos.y<maxY){
                    this.vel.y -= 50
                   // this.accel.y -=2
                    } 

                    if(this.pos.y<=10){
                        //this.vel.y=0
                        this.pos.y=10
                        //this.accel.y+=2
                    }

            } 
            

            if (ig.input.state('down'))
            {
                this.friction.y = this.standing ? this.frictionDef.ground : this.frictionDef.air;
                   if(this.pos.y>maxY){
                      //  console.log("stuck1")
                        this.vel.y = 35
                     //   this.accel.y += 2
                    }
                    else
                    if(this.pos.y<=15){
                     ////   console.log("stuck2")
                        this.pos.y=15
                        this.vel.y += 35
                       // this.accel.y += 2
                    } else{
                     // console.log("stuck3")  
                      this.vel.y +=35
                   // this.accel.y += 2
                    
                    }
                   
                    
            }
            
            if (ig.input.state('left'))
            {
               // this.accel.x = -(this.standing ? this.accelDef.ground : this.accelDef.air);
                this.flip = true;
                this.moved = true;
                this.currentAnim = this.anims.accelerate
                //this.accel.x -= 4
                this.vel.x -=50;
                
            }
            
            if (ig.input.state('right'))
            {
                //this.accel.x = (this.standing ? this.accelDef.ground : this.accelDef.air);
                //this.accel.x += 4
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
        if(this.pos.y<0) {
            this.pos.y = 10;
        }
        
        if(this.pos.y>=maxY) {
            this.pos.y = maxY-10;
            this.vel.y=0
        }
        if(this.pos.x<=0){
            this.pos.x=0;
            this.vel.x=0;
        }

        if(this.pos.x>maxX){
            this.pos.x=maxX-10;
            this.vel.x=0;
        }
     
        if(this.pos.x<10){
            this.pos.x=10;
        }
            
                        
        if (ig.input.pressed('shoot'))
        {
        // this.getEntitiesByType(EntityPlayer)[0].Entity.COLLIDES.LITE;

        if(this.laserTimer.delta() > 0){
        this.sfxLaser.play();
        var x = this.pos.x + (this.flip ? -3 : 5);
        var y = this.pos.y + 6;
        ig.game.laserLeft-=1;

        ig.game.spawnEntity(EntityProjectile, x+46, y+14, {
            flip: this.flip
        });
        this.laserTimer.set(0.25)
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
  /*          if (axis == 'y' && this.standing && this.currentAnim != this.anims.die)
            {
                this.currentAnim.update();
                this.setAnimation();
            }
*/
        },
        receiveDamage: function (amount, from)
        {

            if (this.currentAnim != this.anims.die)
            {
                this.currentAnim = this.anims.die.rewind();
                for (var i = 0; i < 4; i++)
                {
                // add death anim
                //    ig.game.spawnEntity(EntityPlayerGib, this.pos.x, this.pos.y);
                }

                this.sfxDie.play();
            }
        },
        kill: function ()
        {
            this.currentAnim= this.anims.die

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
    
    EntityProjectile = ig.Entity.extend(
    {
        size: {
            x: 4,
            y: 34
        },
        offset: {
            x: 0,
            y: 0
        },
        maxVel: {
            x: 0,
            y: 500
        },
        vel: {
            x: 0,
            y: 500
        },
        gravityFactor: 0,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NONE,
        flip: false,
        hasHit: false,
        lifetime: 3,
        animSheet: new ig.AnimationSheet('media/laserbeam_purple_vert.png', 4, 34),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.vel.x=0
            this.vel.y=500
            this.addAnim('idle', 1, [0]);
            this.addAnim('hit', 0.1, [0], true);
            this.idleTimer = new ig.Timer();
        },
        update: function ()
        {
            if (this.idleTimer.delta() > this.lifetime) {
                this.kill();
            }
            
            this.parent();
        },
        check: function (other)
        {
 
            
                other.receiveDamage(20, this);
                this.hasHit = true;
                this.kill();
                ig.game.score+=500;
            
        }
        });
       
   

  
   
    
});