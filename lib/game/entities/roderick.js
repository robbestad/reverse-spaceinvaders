ig.module(
	'game.entities.roderick'
)
.requires(
	'impact.entity',
	'impact.sound',
	'plugins.box2d.entity'
)
.defines(function(){

EntityRoderick = ig.Box2DEntity.extend({
	size: {x: 8, y:14},
	offset: {x: 4, y: 2},
	sfxDie: new ig.Sound('media/sounds/die-respawn.ogg', false),
       
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	
	animSheet: new ig.AnimationSheet( 'media/player.png', 16, 24 ),	
	
	flip: false,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'jump', 0.07, [1,2] );
	},
	
	 
		kill: function ()
        {
        
            this.parent();
            ig.game.respawnPlayerAtLastCheckpoint(this.pos.x, this.pos.y);
        },
       
	
	
	
	
	update: function() {
		
		
		// move left or right
		if( ig.input.state('left') ) {
			this.body.ApplyForce( new b2.Vec2(-20,0), this.body.GetPosition() );
			this.flip = true;
		}
		else if( ig.input.state('right') ) {
			this.body.ApplyForce( new b2.Vec2(20,0), this.body.GetPosition() );
			this.flip = false;
		}
		
		// jetpack
		if( ig.input.state('jump') ) {
			this.body.ApplyForce( new b2.Vec2(0,-30), this.body.GetPosition() );
			this.currentAnim = this.anims.jump;
		}
		else {
			this.currentAnim = this.anims.idle;
		}
		
		// shoot
		if( ig.input.pressed('shoot') ) {
			var x = this.pos.x + (this.flip ? -6 : 6 );
			var y = this.pos.y + 6;
			ig.game.spawnEntity( EntityProjectile, x, y, {flip:this.flip} );
		}
		
		this.currentAnim.flip.x = this.flip;
		
		
		// This sets the position and angle. We use the position the object
		// currently has, but always set the angle to 0 so it does not rotate
		this.body.SetXForm(this.body.GetPosition(), 0);
		
		// move!
		this.parent();
	}
});

EntityProjectile = ig.Entity.extend(
    {
        size: {
            x: 6,
            y: 3
        },
        offset: {
            x: 1,
            y: 2
        },
        maxVel: {
            x: 200,
            y: 0
        },
        gravityFactor: 0,
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.NEVER,
        flip: false,
        hasHit: false,
        animSheet: new ig.AnimationSheet('media/sprites/projectile.png', 8, 8),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim('idle', 1, [0]);
            this.addAnim('hit', 0.1, [0, 1, 2, 3, 4, 5], true);
        },
        update: function ()
        {
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
            
                other.takingDmg=true;
			    /*
			    var maxAlpha = other.health/100;
			    var minAlpha = maxAlpha/10;
			    other.currentAnim.alpha = Math.random().map(0,1,minAlpha, maxAlpha);
			    */
            }
        }
    });


EntityGrenade = ig.Box2DEntity.extend({
	size: {x: 8, y: 4},
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, 
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
		
	animSheet: new ig.AnimationSheet( 'media/projectile.png', 8, 4 ),	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
		this.currentAnim.flip.x = settings.flip;
		
		var velocity = (settings.flip ? -10 : 10);
		this.body.ApplyImpulse( new b2.Vec2(velocity,0), this.body.GetPosition() );
	}
});

});