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
	font: new ig.Font( 'media/04b03.font.png' ),
	displaytimer: null,
	text: null,
	triggeredBy: function( entity, trigger ) {	
	this.displaytimer=new ig.Timer(5);
    this.text=this.message;	 
    },
    update: function(){
    
    	if(this.displaytimer && this.displaytimer.delta()<0){
    		    ig.game.OutputText=this.text;
        }
 
     
    },
  	
	
});

});
