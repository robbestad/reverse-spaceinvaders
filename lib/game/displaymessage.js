/*
This entity calls ig.game.loadLevel() when its triggeredBy() method is called -
usually through an EntityTrigger entity.


Keys for Weltmeister:

level
	Name of the level to load. E.g. "LevelTest1" or just "test1" will load the 
	'LevelTest1' level.
*/

ig.module(
	'game.entities.displaymessage'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityDisplaymessage = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(0, 0, 255, 0.7)',
	
	size: {x: 8, y: 8},
	level: null,
    nextlevelTimer: null,
    waitTimer: null,
  
	triggeredBy: function( entity, trigger ) {	
		
		this.font.draw('Level Complete!', ig.system.width / 2, 20, ig.Font.ALIGN.CENTER);
            
	},
    
    draw: function(){
        
     
    },
	
	update: function(){}
});

});
