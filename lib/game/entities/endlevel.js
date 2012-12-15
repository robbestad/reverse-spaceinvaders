/*
This entity calls ig.game.loadLevel() when its triggeredBy() method is called -
usually through an EntityTrigger entity.


Keys for Weltmeister:

level
	Name of the level to load. E.g. "LevelTest1" or just "test1" will load the 
	'LevelTest1' level.
*/

ig.module(
	'game.entities.endlevel'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityEndlevel = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(0, 0, 255, 0.7)',
	
	size: {x: 8, y: 8},
	level: null,
    nextlevelTimer: null,
    waitTimer: null,
    wait:-1,
    showCount: true,
    message: 'Well done! Level completed',
    font: new ig.Font('media/04b03.font.png'),
	
	triggeredBy: function( entity, trigger ) {	
		if( this.level ) {
			
			var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
				return a.toUpperCase() + b;
			});
			this.nextlevelTimer=new ig.Timer(7);
			this.waitTimer = new ig.Timer(5);
            ig.game.nextLevel=levelName;
            ig.game.nextLevelX=this.xpos;
            ig.game.nextLevelY=this.ypos;
            
		//	ig.game.loadLevelDeferred( ig.global['Level'+levelName] );
		//ig.game.endLevel(ig.global['LevelLevel' + levelName],this.xpos,this.ypos);
		}
	},
    
    draw: function(){
        if(this.nextlevelTimer && this.nextlevelTimer.delta()<0){
            this.font.draw(this.message,100, 100);
        
         var i=0;
         this.font.draw("Score: ",ig.system.width/2-20, ig.system.height/2+20);    
         while(i<ig.game.jetGas){
             if(this.waitTimer.delta()<0){
                ig.game.score+=1;
                ig.game.jetGas-=1;
                i++;
                this.font.draw(ig.game.score,ig.system.width/2+10, ig.system.height/2+20);    
             }   
         }
         this.font.draw(ig.game.score,ig.system.width/2+10, ig.system.height/2+20);    
        } else {
          ig.game.endLevel(ig.global['LevelLevel' + ig.game.nextLevel],ig.game.nextLevelX,ig.game.nextLevelY);  
        }
    },
	
	update: function(){}
});

});
