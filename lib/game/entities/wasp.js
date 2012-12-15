/*
Simple Mover that visits all its targets in an ordered fashion. You can use
the void entities (or any other) as targets.


Keys for Weltmeister:

speed
    Traveling speed of the mover in pixels per second.
    Default: 20
    
target.1, target.2 ... target.n
    Names of the entities to visit.
*/

ig.module(
    'game.entities.wasp'
)
.requires(
    'impact.entity',
    'game.entities.particle'
)
.defines(function(){
    EntityWasp = ig.Entity.extend(
    {
        size: {
            x: 22,
            y: 25
        },
        maxVel: {
            x: 100,
            y: 100
        },
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.FIXED,
        target: null,
        targets: [],
        currentTarget: 0,
        speed: 20,
        health: 30,
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet('media/sprites/wasp.png', 22, 25),
        sfxHit: new ig.Sound('media/sounds/wetgib.ogg'),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 1, [0,1,2]);
            this.addAnim('hit', 0.1, [3]);
            this.parent(x, y, settings);
            this.targets = ig.ksort(this.target);
        },
        update: function ()
        {
            var oldDistance = 0;
            var target = ig.game.getEntityByName(this.targets[this.currentTarget]);
             if (this.currentAnim == this.anims.hit && this.currentAnim.loopCount)
            {
                this.currentAnim = this.anims.idle;
            }
            if (target)
            {
                oldDistance = this.distanceTo(target);
                var angle = this.angleTo(target);
                this.vel.x = Math.cos(angle) * this.speed;
                this.vel.y = Math.sin(angle) * this.speed;
            }
            else
            {
                this.vel.x = 0;
                this.vel.y = 0;
            }
            
            if(this.vel.x>0)this.currentAnim.flip.x=false;
            else if(this.vel.x<0)this.currentAnim.flip.x=true;
            //this.currentAnim.flip.x = ((this.pos.x+32) - target.pos.x > 0);
            this.parent();
            var newDistance = this.distanceTo(target);
            if (target && (newDistance > oldDistance || newDistance < 0.5))
            {
                this.pos.x = target.pos.x + target.size.x / 2 - this.size.x / 2;
                this.pos.y = target.pos.y + target.size.y / 2 - this.size.y / 2;
                this.currentTarget++;
                if (this.currentTarget >= this.targets.length && this.targets.length > 1)
                {
                    this.currentTarget = 0;
                }
                 
            }
        },
        receiveDamage: function (amount, from)
        {
            this.parent(amount);
            this.currentAnim = this.anims.hit.rewind();
            this.sfxHit.play();
            if(this.health<0) this.kill();
            
        },
         kill: function ()
        {
             ig.game.score+=1000;
           
            var gibs = ig.ua.mobile ? 5 : 30;
            for (var i = 0; i < gibs; i++)
            {
                ig.game.spawnEntity(EntityWaspGib, this.pos.x, this.pos.y);
            }
            this.parent();
        },
        check: function (other)
        {
            other.receiveDamage(10, this);
        },
    });
     EntityWaspGib = EntityParticle.extend(
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
        animSheet: new ig.AnimationSheet('media/sprites/wasp-gibs.png', 4, 4),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 0.1, [0, 1, 2]);
            this.parent(x, y, settings);
        }
    });
});
