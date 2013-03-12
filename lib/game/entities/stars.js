/*
This entity calls ig.game.loadLevel() when its triggeredBy() method is called -
usually through an EntityTrigger entity.


Keys for Weltmeister:

level
	Name of the level to load. E.g. "LevelTest1" or just "test1" will load the 
	'LevelTest1' level.
*/

ig.module(
	'game.entities.stars'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityStars = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(0, 0, 255, 0.7)',
	    size: {
            x: 3,
            y: 3
        },
        offset: {
            x: 0,
            y: 0
        },
        maxVel:{
            x:300,
            y:-100
        },
        vel:{
            x:0,
            y:-500
        },
        scale:{
        	x:1,
        	y:1
        },
        offset:{
        	//cached offset prior to scaling
        	x:0,
        	y:0
        },
        _offset:{
        	//cached offset prior to scaling
        	x:0,
        	y:0
        },
        _scale:{
        	//scale relative to ig.system.scale
        	x:1,
        	y:1
        },
        _size:{
        	  //cached size prior to scaling
        	x:3,
        	y:3
        },
        size:{
        	x:3,
        	y:3
        },
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NEVER,
        health: 1000,
        shootTimer: null,

        shootWaitTimer: null,
        reverseTimer: null,
        move: 'left',
        blinkTimer:null,
        canShoot: false,
        scaleTimer: new ig.Timer(0),
        animSheet: new ig.AnimationSheet('media/white.png', 3, 3),
    	text: null,
	
	init: function (x, y, settings)
	{
	    this.parent(x, y, settings);
	    this.addAnim('idle', 1, [0]);
	    this._offset.x = this.offset.x;
	    this._offset.y = this.offset.y;
	    this._size.x = this.size.x;
	    this._size.y = this.size.y;
	    this.setScale( this.scale.x, this.scale.y );
	    this.setAnimation();

	},
	update: function(){
	var maxX = ig.game.collisionMap.width  * ig.game.collisionMap.tilesize;
	var maxY = ig.game.collisionMap.height * ig.game.collisionMap.tilesize;
	if(this.pos.y>maxY+50){this.kill()}
	if(this.pos.y<0){this.kill()}
	this.parent();
    },
  	
	draw: function(){
    var ctx = ig.system.context;
    ctx.save();
    ctx.translate(
    ig.system.getDrawPos( this.pos.x.round() - this.offset.x - ig.game.screen.x ),
    ig.system.getDrawPos( this.pos.y.round() - this.offset.y - ig.game.screen.y )
    );
    ctx.scale( this._scale.x, this._scale.y );
    this.currentAnim.draw( 0, 0 );
    ctx.restore();
    },

    setScale: function( x, y ){
    //cache size prior to scaling
    var oX = this.size.x,
    oY = this.size.y;

    //set scale
    this.scale.x = x || this.scale.x;
    this.scale.y = y || this.scale.y;

    //set scale relative to game scale
    this._scale.x = this.scale.x / ig.system.scale;
    this._scale.y = this.scale.y / ig.system.scale;

    //scale offset
    this.offset.x = this._offset.x * this._scale.x;
    this.offset.y = this._offset.y * this._scale.y;

    //scale size
    this.size.x = this._size.x * this._scale.x;
    this.size.y = this._size.y * this._scale.y;

    //offset entity's position by the change in size
    this.pos.x += (oX - this.size.x) / 0.2;
    this.pos.y += (oY - this.size.y) / 0.2;
    },
	setAnimation: function ()
	{
	this.currentAnim = this.anims.idle;
	},
	handleMovementTrace: function (res)
    {
        this.parent(res);
    }
    });

});
