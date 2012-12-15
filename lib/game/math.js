ig.module(
	'game.math'
)
.requires()
.defines(function(){

	ig.math = ig.math || {};

	ig.math.angleTo = function( xyObj1, xyObj2 ){
		return Math.atan2( xyObj1.y, xyObj1.x ) 
            - Math.atan2( xyObj2.y, xyObj2.x );
	}

	//ig.math.rotateXY = function( xyObj, angle )

});