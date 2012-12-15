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
	'game.entities.menulogo'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityMenulogo = ig.Entity.extend(
    {
        size: {
            x: 226,
            y: 79
        },
        maxVel: {
            x: 500,
            y: 500
        },
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.FIXED,
        target: null,
        targets: [],
        currentTarget: 0,
        speed: 100,
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet('media/jetmanjunior.png', 226, 79),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 1, [0]);
            this.parent(x, y, settings);
            this.targets = ig.ksort(this.target);
        },
        update: function ()
        {
            
            var oldDistance = 0;
            var target = ig.game.getEntityByName(this.targets[this.currentTarget]);
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
        
    });
});