ig.module(
	'game.entities.rock48'
)
.requires(
	'plugins.box2d.immovable'
)
.defines(function(){

EntityRock48 = ig.Box2DEntity.extend({
	size: {x: 16, y: 48},
	
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,
	
	animSheet: new ig.AnimationSheet( 'media/sprites/rock48.png', 16, 48 ),
	
	init: function( x, y, settings ) {
		this.addAnim( 'idle', 1, [0] );
		this.parent( x, y, settings );
		this.takingDmg=false;
		this.timer=0;
	},
	update: function (){
		 this.timer=this.timer+1; 
	
		/*
		 if (this.health < 25)
			  {
			    var maxAlpha = this.health/100;
			    var minAlpha = maxAlpha/10;
			    this.currentAnim.alpha = Math.random().map(0,1,minAlpha, maxAlpha);
			  }
		*/	  
		if(this.takingDmg){
			    var maxAlpha = this.health/100;
			    var minAlpha = maxAlpha/10;
			    this.currentAnim.alpha = Math.random().map(0,1,minAlpha, maxAlpha);
			    this.timer=0;
			    this.takingDmg=false;
			    /*
			    this.currFrame = this.currentAnim.frame;
			    this.currentAnim = this.anims.damagedIdle;
			    this.currentAnim.frame = this.currFrame;
			
			    this.takingDmg = false;
			    */
			}	
			
			if(this.timer==3){
				this.currentAnim.alpha=255;
			} 
			
			
	
	}
});


});