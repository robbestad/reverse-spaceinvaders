ig.module('game.entities.ufo').
requires('impact.entity', 'game.entities.particle').defines(function ()
{
    EntityUfo = ig.Entity.extend(
    {
        size: {
            x: 254,
            y: 121
        },
        offset: {
            x: 0,
            y: 0
        },
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
        health: 60,
        shootTimer: null,
        shootWaitTimer: null,
        reverseTimer: null,
        move: 'left',
        canShoot: false,
        scaleTimer: new ig.Timer(0),
        animSheet: new ig.AnimationSheet('media/vw/enemy_spaceship.png', 254, 121),
        sfxHit: new ig.Sound('media/sounds/wetgib.ogg'),
        scale: { x: 1, y: 1 },  //user-defined scale
        _offset: { x: 0, y: 0 },    //cached offset prior to scaling
        _scale: { x: 1, y: 1 }, //scale relative to ig.system.scale
        _size: { x: 254, y: 121 },  //cached size prior to scaling
        

        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.shootWaitTimer = new ig.Timer(1);
            this.shootTimer = new ig.Timer(1);
            this.reverseTimer = new ig.Timer(10);
            this.addAnim('idle', 0.5, [0]);
            this.addAnim('shoot', 0.5, [0]);
            this.addAnim('hit', 0.1, [0]);
            this._offset.x = this.offset.x;
            this._offset.y = this.offset.y;
            this._size.x = this.size.x;
            this._size.y = this.size.y;
           // this.setScale( this.scale.x, this.scale.y );

        },
        update: function ()
        {
            if(this.reverseTimer.delta() > 0){
            this.move = (this.move==='left' ? 'right' : 'left');
            this.reverseTimer.set(10)
            console.log("reverse");
            } 

            if(this.move==='right'){
            this.vel.x-=5
            } else {
            this.vel.x+=5
            }

            if(this.shootTimer.delta() > 0){
            ig.game.spawnEntity(EntityFroskShot, this.pos.x + 4, this.pos.y + 4);
            this.shootTimer.set(2)
            }

            if (this.currentAnim == this.anims.hit && this.currentAnim.loopCount)
            {
                this.currentAnim = this.anims.idle;
                this.shootWaitTimer.set(0.5);
            }
            else if (this.currentAnim == this.anims.idle && this.shootWaitTimer.delta() > 0 && this.distanceTo(ig.game.player) < 80)
            {
                this.currentAnim = this.anims.shoot.rewind();
                this.shootTimer.set(0.45);
                this.canShoot = true;
            }
            else if (this.currentAnim == this.anims.shoot && this.canShoot && this.shootTimer.delta() > 0)
            {
                this.canShoot = false;
                ig.game.spawnEntity(EntityFroskShot, this.pos.x + 4, this.pos.y + 4);
            }
            if (this.currentAnim == this.anims.shoot && this.currentAnim.loopCount)
            {
                this.currentAnim = this.anims.idle.rewind();
                this.shootWaitTimer.set(1.5);
            }
            this.currentAnim.flip.x = (this.pos.x - ig.game.player.pos.x < 0);

            if (this.scaleTimer.delta() > 0) {
                this.setScale( (ig.system.scale), (ig.system.scale) );    
            }
            this.parent();
        },
        kill: function ()
        {
            ig.game.screentext="500";
            
            ig.game.score+=500;
            this.spawnGibs(100);
            this.parent();
        },
        check: function (other)
        {
            other.receiveDamage(10, this);
        },  
        receiveDamage: function (amount, from)
        {
            this.currentAnim = this.anims.hit.rewind();
            this.spawnGibs(1);
           // this.scaleTimer.set(0.05);
           // this.setScale( (ig.system.scale+1), (ig.system.scale+0.2) );   

            this.parent(amount);
            
            this.sfxHit.play();
        },
        spawnGibs: function (amount)
        {
            var cx = this.pos.x + this.size.x / 1;
            var cy = this.pos.y + this.size.y / 1;
            for (var i = 0; i < amount; i++)
            {
                ig.game.spawnEntity(EntityFroskGib, cx, cy);
            }
        },
            draw: function(){
            var ctx = ig.system.context;
            ctx.save();
            ctx.translate(
            ig.system.getDrawPos( this.pos.x.round() - this.offset.x - ig.game.screen.x ),
            ig.system.getDrawPos( this.pos.y.round() - this.offset.y - ig.game.screen.y )
            );
            ctx.scale( this._scale.x, this._scale.y );
            this.currentAnim.draw( 0, 0 );
            ctx.restore();
            },

            setScale: function( x, y ){
            //cache size prior to scaling
            var oX = this.size.x,
            oY = this.size.y;

            //set scale
            this.scale.x = x || this.scale.x;
            this.scale.y = y || this.scale.y;

            //set scale relative to game scale
            this._scale.x = this.scale.x / ig.system.scale;
            this._scale.y = this.scale.y / ig.system.scale;

            //scale offset
            this.offset.x = this._offset.x * this._scale.x;
            this.offset.y = this._offset.y * this._scale.y;

            //scale size
            this.size.x = this._size.x * this._scale.x;
            this.size.y = this._size.y * this._scale.y;

            //offset entity's position by the change in size
            this.pos.x += (oX - this.size.x) / 0.2;
            this.pos.y += (oY - this.size.y) / 0.2;
            }
    });
    EntityFroskShot = ig.Entity.extend(
    {
        friction: {
            x: 20,
            y: 20
        },
        bounciness: 0.7,
        size: {
            x: 58,
            y: 24
        },
        vel: {
            x: 260,
            y: 0	
        },
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.LITE,
        bounceCount: 0,
        animSheet: new ig.AnimationSheet('media/vw/laserbeam_red.png', 58, 24),
        init: function (x, y, settings)
        {
            var xdir = x - ig.game.player.pos.x > 0 ? -1 : 1;
            this.vel.x = Math.random().map(0, 1, 40, 120) * xdir;
            this.vel.y = 0;
            this.addAnim('idle', 0.1, [0]);
            this.parent(x, y, settings);
        },
        handleMovementTrace: function (res)
        {
            this.parent(res);
            if (res.collision.x || res.collision.y)
            {
                this.bounceCount++;
                if (this.bounceCount >= 3)
                {
                    ig.game.spawnEntity(EntityFroskShotGib,this.pos.x,this.pos.y);
                  //  ig.game.spawnEntity(EntityFroskShotGib,this.pos.x+1,this.pos.y+1);
                 //   ig.game.spawnEntity(EntityFroskShotGib,this.pos.x+2,this.pos.y+2);
                    this.kill();
                }
            }
        },
        check: function (other)
        {
            other.receiveDamage(10, this);
            this.kill();
        }
    });
    EntityFroskGib = EntityParticle.extend(
    {
        lifetime: 1,
        fadetime: 0.5,
        bounciness: 0.6,
        vel: {
            x: 50,
            y: 150
        },
        size: {
            x: 4,
            y: 4
        },
        animSheet: new ig.AnimationSheet('media/vw/enemy_spaceship.png', 10, 10),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 5, [18, 19, 38, 39]);
            this.parent(x, y, settings);
        }
    });
    EntityFroskShotGib = EntityParticle.extend(
    {
        lifetime: 0.7,
        fadetime: 0.7,
        bounciness: 0.1,
        vel: {
            x: 30,
            y: 0
        },
        size: {
            x: 58,
            y: 24
        },
        animSheet: new ig.AnimationSheet('media/vw/laserbeam_red.png', 58, 24),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 0.1, [0]);
            this.parent(x, y, settings);
        }
    });
});
