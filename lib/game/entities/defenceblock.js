

ig.module(
	'game.entities.defenceblock'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityDefenceblock = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(0, 0, 255, 0.7)',
	    size: {
            x: 89,
            y: 59
        },
        offset: {
            x: 0,
            y: 0
        },
        maxVel:{
            x:50,
            y:50
        },
        vel:{
            x:50,
            y:50
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
            x: 89,
            y: 59
        },
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.NEVER,
        health: 300,
        startX:null,
        startY:null,
        blinkTimer:null,
        canShoot: false,
        scaleTimer: new ig.Timer(0),
        animSheet: new ig.AnimationSheet('media/blocks.png', 89, 59),
    	text: null,
	
	init: function (x, y, settings)
	{
	    this.parent(x, y, settings);
	    this.addAnim('idle', 1, [0]);
        this.addAnim('hit', 1, [3]);
	    this.addAnim('damaged1', 0.2, [0]);
        this.addAnim('damaged2', 0.2, [0]);
        this._offset.x = this.offset.x;
	    this._offset.y = this.offset.y;
	    this._size.x = this.size.x;
	    this._size.y = this.size.y;
        this.startX=this.pos.x;
	    this.startY=this.pos.y;
        this.setScale( this.scale.x, this.scale.y );
	    this.setAnimation();
        this.blinkTimer = new ig.Timer(0);


	},
	update: function(){
	if(this.blinkTimer.delta() > 0){
    //if(this.health<300) this.setScale(1.1,1.1); this.pos.x=this.startX; this.pos.y=this.startY;
    //if(this.health<200) this.setScale(1.2,1.2); this.pos.x=this.startX; this.pos.y=this.startY;
    //if(this.health<100) this.setScale(1.3,1.3); this.pos.x=this.startX; this.pos.y=this.startY;
    
    //if(this.health<300) this.currentAnim=this.anims.damaged1
    //if(this.health<200) this.currentAnim=this.anims.damaged2
    //if(this.health>=300) this.currentAnim=this.anims.idle
        this.currentAnim=this.anims.idle
    }
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
    receiveDamage: function(amount,from)
    {
        this.currentAnim=this.anims.hit
        this.blinkTimer.set(0.15)
        this.parent(amount)
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
