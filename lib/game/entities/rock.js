ig.module(
	'game.entities.rock'
)
.requires(
	'plugins.box2d.entity'
)
.defines(function(){

EntityRock = ig.Box2DEntity.extend({
	size: {x: 16, y: 16},
	
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.ALWAYS,
	
	animSheet: new ig.AnimationSheet( 'media/rock.png', 16, 16 ),
	
	init: function( x, y, settings ) {
		this.addAnim( 'idle', 1, [0] );
		this.parent( x, y, settings );
	}
});


});