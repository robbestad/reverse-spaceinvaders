ig.module('game.entities.blob').requires('impact.entity', 'game.entities.particle').defines(function ()
{
    EntityBlob = ig.Entity.extend(
    {
        size: {
            x: 20,
            y: 28
        },
        offset: {
            x: 0,
            y: 0
        },
        maxVel: {
            x: 100,
            y: 100
        },
        seenPlayer: false,
        inJump: false,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        jumpTimer: null,
        health: 40,
        scaleTimer: new ig.Timer(0.1),
        sfxGib: new ig.Sound('media/sounds/wetgib.ogg'),
        animSheet: new ig.AnimationSheet('media/sprites/blob28.png', 20, 28),
        scale: { x: 1, y: 1 },  //user-defined scale
        _offset: { x: 0, y: 0 },    //cached offset prior to scaling
        _scale: { x: 1, y: 1 }, //scale relative to ig.system.scale
        _size: { x: 0, y: 0 },  //cached size prior to scaling

        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.jumpTimer = new ig.Timer();
            this.addAnim('idle', 0.5, [2,3]);
            this.addAnim('crawl', 0.1, [4, 5, 6, 7]);
            this.addAnim('jump', 0.2, [4, 5, 6]);
            this.addAnim('hit', 0.1, [4]);
            this.currentAnim.gotoRandomFrame();
            this.currentAnim.flip.x = (Math.random() > 0.5);
            this._offset.x = this.offset.x;
            this._offset.y = this.offset.y;
            this._size.x = this.size.x;
            this._size.y = this.size.y;
            this.setScale( this.scale.x, this.scale.y );
        },
        update: function ()
        {
        var xdist = Math.abs(ig.game.player.pos.x - this.pos.x);
        var ydist = Math.abs(ig.game.player.pos.y	- this.pos.y);
            var xpos=ig.game.player.pos.x; //ig.game.player.pos.x 
            
            var xdir = xpos - this.pos.x < 0 ? -1 : 1;
            var wasStanding = this.standing;
            if (!this.seenPlayer)
            {
                if (xdist < 64 && ydist < 20)
                {
                    this.seenPlayer = true;
                }
            }
            else if (this.standing && this.currentAnim != this.anims.hit)
            {
                if (this.currentAnim != this.anims.jump && this.jumpTimer.delta() > 0.5 && ((xdist < 40 && xdist > 20) || ig.game.collisionMap.getTile(this.pos.x + this.size.x * xdir, this.pos.y + this.size.y) == 1))
                {
                    this.currentAnim = this.anims.jump.rewind();
                    this.currentAnim.flip.x = (xdir < 0);
                    this.vel.x = 0;
                }
                else if (this.currentAnim == this.anims.jump && this.currentAnim.loopCount)
                {
                    this.vel.y = -70;
                    this.vel.x = 60 * (this.currentAnim.flip.x ? -1 : 1);
                    this.inJump = true;
                }
                else if (this.currentAnim != this.anims.jump && this.jumpTimer.delta() > 0.2)
                {
                    this.currentAnim = this.anims.crawl;
                    this.currentAnim.flip.x = (xdir < 0);
                    this.vel.x = 20 * xdir;
                }
            }
            if (this.currentAnim == this.anims.hit && this.currentAnim.loopCount)
            {
                this.currentAnim = this.anims.idle;
            }
            if (this.inJump && this.vel.x == 0 && this.currentAnim != this.anims.hit)
            {
                this.vel.x = 30 * (this.currentAnim.flip.x ? -1 : 1);
            }
            if (this.standing && !wasStanding && this.currentAnim != this.anims.hit)
            {
                this.inJump = false;
                this.jumpTimer.reset();
                this.anims.idle.flip.x = this.currentAnim.flip.x;
                this.currentAnim = this.anims.idle;
                this.vel.x = 0;
            }

            if (this.scaleTimer.delta() > 0) {
                this.setScale( (ig.system.scale), (ig.system.scale) );    
            }
               this.parent();
         
        },
        kill: function ()
        {
            ig.game.score+=1000;
            ig.game.OutputText="1000";
            var gibs = ig.ua.mobile ? 5 : 30;
            for (var i = 0; i < gibs; i++)
            {
                ig.game.spawnEntity(EntityBlobGib, this.pos.x, this.pos.y);
            }
            this.parent();
        },
        receiveDamage: function (amount, from)
        {
            this.anims.hit.flip.x = this.currentAnim.flip.x;
            this.currentAnim = this.anims.hit.rewind();
            this.seenPlayer = true;
            this.inJump = false;
            this.scaleTimer.set(0.05);
            this.setScale( (ig.system.scale+1), (ig.system.scale+1) );   
            this.vel.x = from.vel.x > 0 ? 50 : -50;
            var gibs = ig.ua.mobile ? 2 : 5;
            for (var i = 0; i < gibs; i++)
            {
                ig.game.spawnEntity(EntityBlobGib, this.pos.x, this.pos.y);
            }
            this.sfxGib.play();
            this.parent(amount);
        },
        check: function (other)
        {
            other.receiveDamage(10, this);
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