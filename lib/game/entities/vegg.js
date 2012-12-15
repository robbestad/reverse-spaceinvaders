ig.module('game.entities.vegg').requires('impact.entity', 'game.entities.particle').defines(function ()
{
    EntityVegg = ig.Entity.extend(
    {
        size: {
            x: 34,
            y: 60
        },
        offset: {
            x: 0,
            y: 0
        },
        type: ig.Entity.TYPE.BOTH,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.FIXED,
        health: 500,
        takingDmg:false,
        timer:0,
        animSheet: new ig.AnimationSheet('media/sprites/vegg.png', 34, 60),
       // sfxHit: new ig.Sound('media/sounds/drygib.ogg'),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.5, [0]);
        	this.timer=0;
	    },
        update: function ()
        {
    	    this.timer=this.timer+1; 
	
            if(this.health<0) this.kill();
            this.parent();
            
            if(this.takingDmg){
			    /*
			    var maxAlpha = this.health/1000;
			    var minAlpha = maxAlpha/10;
			    this.currentAnim.alpha = Math.random().map(0,1,minAlpha, maxAlpha);
			    this.timer=0;
			    console.log("vegg: "+this.health);
			    */
			    this.takingDmg=false;
			}	
			
			if(this.timer==4){
				this.currentAnim.alpha=255;
				this.timer=0;
			} 
			
			
	
	
           
        },
        kill: function ()
        {
           ig.game.score+=0;
           this.parent();
        },
        check: function (other)
        {
            //other.receiveDamage(10, this);
        },
        receiveDamage: function (amount, from)
        {
            //console.log("hit");
            //this.currentAnim = this.anims.hit.rewind();
            //this.sfxHit.play();
            this.health-=amount;
            this.takingDmg=true;
           	this.timer=0;
			
        }
        
    });
   
});