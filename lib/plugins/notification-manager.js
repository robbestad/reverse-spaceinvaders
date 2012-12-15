/*
 * Impact Plugin
 * NotificationManager
 * Written by Abraham Walters
 * July 2011
 * Jxyzzy Dev Company
 * jxyzzy.com
 *
 * This plugin extends the Font class and allows you to pop-up a
 * text Notification (spawnNote()), move it (this.pos) and have
 * it fade after a specified amount of time (this.lifetime &
 * this.fadetime). The plugin provides a NotificationManager to
 * do all your dirty work and track each Notification for updating
 * and drawing.
 *
 * To use the plugin you will need to create an instance of the
 * NotificationManager in your ig.game instance (MyGame) like so:
 *
 * myNoteManager: new NotificationManager(),
 *
 * You will then need to add myNoteManager.update() to ig.game.update()
 * and myNoteManager.draw() to ig.game.draw().  Make sure you add 
 * myNoteManager.draw() after the this.parent() draw, otherwise your 
 * Notifications will be drawn over. From there you can spawn a
 * Notification within any Entity using the following syntax:
 *
 * ig.game.myNoteManager.spawnNote('media/font.png', 'string', x, y, settings);
 *
 * Enjoy!
 * 
 */

ig.module(
    'plugins.notification-manager'
)
.requires(
    'impact.impact'
)
.defines(function(){

ig.NotificationManager = ig.Class.extend({
        
    notes: [],
    
    init: function() {},
    
    draw: function() {
        
        for(var i = 0; i < this.notes.length; i++) {
            this.notes[i].draw();
        }
        
    },
    
    spawnNote: function( font, text, x, y, settings) {
        
        var note = new Notification( font, text, x, y, settings );
        this.notes.push( note );
        
    },
    
    spawnWordBalloon: function ( entity, font, text, x, y, settings){
        
        var wordBalloon = new WordBalloon( entity, font, text, x, y, settings );
        this.notes.push( wordBalloon );
        
    },
    
    update: function() {
        
        for( var i = this.notes.length ; i--; i ) {
            this.notes[i].update();
            
            //if note is dead, erase it
            if( this.notes[i]._kill ) {
                this.notes.splice(i, 1);
            }
        }
    }
    
});


Notification = ig.Class.extend({
        
    font: null,                //font
    text: '',                //string to draw
    pos: { x: null, y: null },  //position
    _kill: null,                //state
    vel: { x: 0, y: -20 },    //velocity - set to 0 if font doesn't move
    alpha: 1,                //alpha, 0 = translucent, 1 = opaque
        
    lifetime: 1.2,                //how long notification should last, set to zero to disable fade
    fadetime: 0.4,                //how long until note fades
        
    init: function( font, text, x, y, settings ) {
        this.font =  font;
        this.text = text;
        this._kill = false;
                
        this.pos.x = x - ig.game.screen.x;
        this.pos.y = y - ig.game.screen.y;

        ig.merge( this, settings );
        
        this.idleTimer = new ig.Timer();
    },
    
    
    update: function() {
            
        //update position
        this.pos.x += (this.vel.x * ig.system.tick);
        this.pos.y += (this.vel.y * ig.system.tick);
        
        //if lifetime = 0, skip fade and kill
        if( !this.lifetime ) {
            return;
        }
        
        //if greater than lifetime, kill note
        if( this.idleTimer.delta() > this.lifetime ) {
            this._kill = true;
            return;
        }
                
        //do fade - slowly dissipate
        this.alpha = this.idleTimer.delta().map(
            this.lifetime - this.fadetime, this.lifetime, 1, 0 );
        
    },
    
    draw: function() {
        
        //set system alpha for fade effect
        if( this.alpha != 1) {
            ig.system.context.globalAlpha = this.alpha;
        }
        
        //draw font
        this.font.draw( this.text,
                       ig.system.getDrawPos(this.pos.x), ig.system.getDrawPos(this.pos.y),
                       ig.Font.ALIGN.LEFT );
        
        //reset system alpha so fade effect doesn't get applied
        //to other objects being drawn
        if( this.alpha != 1) {
            ig.system.context.globalAlpha = 1;
        }
        
    }
    
});

WordBalloon = Notification.extend({
        
    entity: null,                //entity that owns 
    font: null,                //font
    text: '',                //string to draw
    pos: { x: null, y: null },  //position
    _kill: null,                //state
    vel: { x: 0, y: -20 },    //velocity - set to 0 if font doesn't move
    alpha: 1,                //alpha, 0 = translucent, 1 = opaque
        
    lifetime: 1.2,                //how long notification should last, set to zero to disable fade
    fadetime: 0.4,                //how long until note fades
        
    init: function( entity, font, text, x, y, settings ) {
        this.parent( font, text, x, y, settings );
        this.entity = entity;
        

    },
    
    update: function() {
             
        this.pos.x = (this.entity.pos.x - ig.game.screen.x);
        this.pos.y = (this.entity.pos.y - ig.game.screen.y) - 20;
        
        this.parent();
    }
    
});


});
