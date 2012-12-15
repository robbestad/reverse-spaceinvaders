ig.module('game.entities.frosk').
requires('impact.entity', 'game.entities.particle').defines(function ()
{
    EntityFrosk = ig.Entity.extend(
    {
        size: {
            x: 20,
            y: 16
        },
        offset: {
            x: 0,
            y: 0
        },
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
        health: 50,
        shootTimer: null,
        shootWaitTimer: null,
        canShoot: false,
        scaleTimer: new ig.Timer(0),
        animSheet: new ig.AnimationSheet('media/sprites/frosk.png', 20, 16),
        sfxHit: new ig.Sound('media/sounds/wetgib.ogg'),
        scale: { x: 2, y: 2 },  //user-defined scale
        _offset: { x: 0, y: 0 },    //cached offset prior to scaling
        _scale: { x: 1, y: 1 }, //scale relative to ig.system.scale
        _size: { x: 20, y: 16 },  //cached size prior to scaling
        

        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.shootWaitTimer = new ig.Timer(1);
            this.shootTimer = new ig.Timer(10);
            this.addAnim('idle', 0.5, [0, 1, 2]);
            this.addAnim('shoot', 0.5, [3, 4]);
            this.addAnim('hit', 0.1, [3]);
            this._offset.x = this.offset.x;
            this._offset.y = this.offset.y;
            this._size.x = this.size.x;
            this._size.y = this.size.y;
            this.setScale( this.scale.x, this.scale.y );

        },
        update: function ()
        {
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
            this.spawnGibs(10);
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
            this.scaleTimer.set(0.05);
            this.setScale( (ig.system.scale+1), (ig.system.scale+1) );   

            this.parent(amount);
            
            this.sfxHit.play();
        },
        spawnGibs: function (amount)
        {
            var cx = this.pos.x + this.size.x / 2;
            var cy = this.pos.y + this.size.y / 2;
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
            this.pos.x += (oX - this.size.x) / 2;
            this.pos.y += (oY - this.size.y) / 2;
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
            x: 4,
            y: 4
        },
        vel: {
            x: 60,
            y: 0	
        },
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.LITE,
        bounceCount: 0,
        animSheet: new ig.AnimationSheet('media/sprites/frogspewer.png', 4, 4),
        init: function (x, y, settings)
        {
            var xdir = x - ig.game.player.pos.x > 0 ? -1 : 1;
            this.vel.x = Math.random().map(0, 1, 40, 120) * xdir;
            this.vel.y = 0;
            this.addAnim('idle', 0.1, [18, 19, 38, 39]);
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
        animSheet: new ig.AnimationSheet('media/sprites/frogspewer.png', 4, 4),
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
            x: 1,
            y: 1
        },
        size: {
            x: 4,
            y: 4
        },
        animSheet: new ig.AnimationSheet('media/sprites/frogspewer.png', 4, 4),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 0.1, [18, 19, 38, 39]);
            this.parent(x, y, settings);
        }
    });
});
