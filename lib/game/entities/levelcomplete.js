/*
This entity calls ig.game.loadLevel() when its triggeredBy() method is called -
usually through an EntityTrigger entity.


Keys for Weltmeister:

level
	Name of the level to load. E.g. "LevelTest1" or just "test1" will load the 
	'LevelTest1' level.
*/

ig.module(
	'game.entities.levelcomplete'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityLevelcomplete = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(0, 0, 255, 0.7)',
	
	size: {x: 8, y: 8},
	level: null,
    nextlevelTimer: null,
    waitTimer: null,
    wait:-1,
    bonus:0,
    bonusText:null,
    oldmanbonus:false,
    showCount: true,
    message: 'Old man Git found! Game completed',
    font: new ig.Font('media/04b03.font.png'),
	
	triggeredBy: function( entity, trigger ) {	
		if( this.level ) {
			var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
				return a.toUpperCase() + b;
			});

			this.nextlevelTimer=new ig.Timer(10);
			this.waitTimer = new ig.Timer(0.5);
            ig.game.nextLevel=levelName;
            ig.game.nextLevelX=this.xpos;
            ig.game.nextLevelY=this.ypos;
        //	ig.game.loadLevelDeferred( ig.global['Level'+levelName] );
		//ig.game.endLevel(ig.global['LevelLevel' + levelName],this.xpos,this.ypos);
		}
	},
    
    draw: function(){
        if(this.nextlevelTimer && this.nextlevelTimer.delta()<0){
        //    this.font.draw(this.message,90, 100);
        	
        if(!this.oldmanbonus){
        	this.gasBonus=ig.game.jetGas;
		      this.bonus+=10000;
          this.oldmanbonus=true;
        }
           
           this.bonusText=this.message+"\n"+"Remaining gas bonus: "+this.gasBonus+"\nSpecial rescue bonus: 10000"+"\nTotal bonus: "+this.bonus+"\n";
 
       var i=0;
        while(i<ig.game.jetGas){
             if(this.waitTimer.delta()<0){
                this.bonus+=1;
                ig.game.jetGas-=1;
                i++;
             }   
         }
       
        } else {
          
              
          //  ig.game.loadLevel(ig.global['LevelLevel' + ig.game.nextLevel],ig.game.nextLevelX,ig.game.nextLevelY);
        }
         ig.game.score+=this.bonus;
         this.bonus=0    
        if(this.nextlevelTimer) console.log(this.nextlevelTimer.delta());
          if(this.nextlevelTimer && this.nextlevelTimer.delta()>0){
              ig.game.score+=this.bonus;
              ig.game.OutputText=false;
              ig.game.win();
              ig.music.fadeOut(4);

              //ig.game.endLevel(ig.global['LevelLevel' + ig.game.nextLevel],ig.game.nextLevelX,ig.game.nextLevelY);  
          }
         ig.game.OutputText=this.bonusText;
     
    },
	
	update: function(){}
});

});
