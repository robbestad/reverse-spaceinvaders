ig.module(
    'game.entities.portalProjectile'
)
.requires(
    'impact.entity'
)
.defines(function(){
    
EntityPortalProjectile = ig.Entity.extend({
	size: {x: 8, y: 8}
	//,offset: {x: 4, y: 4}
	,maxVel: {x: 800, y: 800}

	//,type: ig.Entity.TYPE.NONE
	,collides: ig.Entity.COLLIDES.PASSIVE
	,gravityFactor: 0

	,angle: 0
	,animSheet: new ig.AnimationSheet( 'media/projectile.png', 8, 8 )

	,hasSpawnedPortal: false

	,init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 0.2, [0] );
		this.addAnim( 'die', 0.05, [1,2,3,4,5] );

		this.vel.x = Math.cos(this.angle) * this.maxVel.x;
		this.vel.y = Math.sin(this.angle) * this.maxVel.y;
	}

	,update: function(){

		var sin, cos, p;

		this.parent();

		if( this.currentAnim == this.anims.die ) {

			// only create portal if this is the first loop of existence
			if( this.hasSpawnedPortal === false ){
				this.angle += Math.PI; // reverse angle for portal creation

				cos = Math.cos( this.angle );
				sin = Math.sin( this.angle );

				// spawn portal!
				p = ig.game.spawnEntity( 
					EntityPortal,
					this.pos.x + (this.size.x / 2), 
					this.pos.y + (this.size.y / 2), 
					{ angle: this.angle } );

				p.pos.x -= (p.size.x / 2);
				p.pos.y -= (p.size.y / 2);

				this.hasSpawnedPortal = true;
			}

	        // Has the animation completely run through? -> kill it
	        if( this.currentAnim.loopCount ) {
	            this.kill();
	        }
	    }

	    // keep angle in sync
	    this.currentAnim.angle = this.angle;
	}

	,handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {
			
			//this.kill();
			this.currentAnim = this.anims.die.rewind();
		}
	}

	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	,check: function( other ) {
		//other.receiveDamage( 10, this );
		//this.kill();
	}
});

});