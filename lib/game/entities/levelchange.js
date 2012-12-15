/*
This entity calls ig.game.loadLevel() when its triggeredBy() method is called -
usually through an EntityTrigger entity.

Keys for Weltmeister:
name: level
text: Name of the level to load. E.g. "Level1" will load LeveLLevel1
*/

ig.module(
	'game.entities.levelchange'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityLevelchange = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(0, 0, 255, 0.7)',
	
	size: {x: 8, y: 8},
	level: null,
	
	triggeredBy: function( entity, trigger ) {	
		if( this.level ) {
			
			var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
				return a.toUpperCase() + b;
			});

			//console.log(levelName);
			if(levelName=="Win") {
				ig.game.win();
           	    ig.music.fadeOut(4);
            }
			

		ig.game.endLevel(ig.global['LevelLevel' + levelName],this.xpos,this.ypos);
		}
	},
	
	update: function(){}
});

});
