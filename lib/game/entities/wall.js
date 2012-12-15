ig.module(
	'game.entities.wall'
)
.requires(
	'plugins.box2d.immovable'
)
.defines(function(){

EntityWall = ig.Box2DEntity.extend({
	size: {x: 16, y: 24},
	
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,
	
	animSheet: new ig.AnimationSheet( 'media/tiles/wallsolid.png', 16, 24 ),
	
	init: function( x, y, settings ) {
		this.addAnim( 'idle', 1, [0] );
        this.addAnim('hit1', 0.2, [0]);
		this.addAnim('hit2', 0.2, [1]);
        this.addAnim('hit3', 0.2, [2]);
        this.addAnim('hit4', 0.2, [3]);
        this.addAnim('hit5', 0.2, [4]);
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
                this.spawnGibs(3);
			    this.takingDmg=false;
			    
			}	
            if(this.health>=60){
                this.currentAnim = this.anims.idle;
            }
            
            if(this.health==50){
                this.currentAnim = this.anims.hit1;
            }
            if(this.health==40){
                this.currentAnim = this.anims.hit2;
            }
            if(this.health==30){
                this.currentAnim = this.anims.hit3;
            }
			if(this.health==20){
                this.currentAnim = this.anims.hit4;
            }
            if(this.health<=10){
                this.currentAnim = this.anims.hit5;
            }
            
			if(this.timer==3){
				this.currentAnim.alpha=255;
			} 
			
			
	
	} ,
     spawnGibs: function (amount)
        {
            var cx = this.pos.x + this.size.x / 2;
            var cy = this.pos.y + this.size.y / 2;
            for (var i = 0; i < amount; i++)
            {
                ig.game.spawnEntity(EntityWallGib, cx, cy);
            }
        }
});

   
    EntityWallGib = EntityParticle.extend(
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