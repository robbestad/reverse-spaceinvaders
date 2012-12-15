ig.module('game.entities.oldman').requires('impact.entity', 'game.entities.particle').defines(function ()
{
    EntityOldman = ig.Entity.extend(
    {
        size: {
            x: 32,
            y: 32
        },
        offset: {
            x: 0,
            y: 0
        },
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
        health: 1000,
        animSheet: new ig.AnimationSheet('media/sprites/oldman.png', 32, 32),
        sfxHit: new ig.Sound('media/sounds/wetgib.ogg'),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.5, [0, 1]);
            this.addAnim('jump', 0.5, [5,6]);
            
        },
        update: function ()
        {
            if (this.currentAnim == this.anims.hit && this.currentAnim.loopCount)
            {
                this.currentAnim = this.anims.idle;
            }
            else if (this.currentAnim == this.anims.idle && this.distanceTo(ig.game.player) < 15)
            {
                this.currentAnim = this.anims.jump.rewind();

                
            }
           
            //this.currentAnim.flip.x = (this.pos.x - ig.game.player.pos.x < 0);
            this.parent();
        },
        check: function (other)
        {
    //        other.receiveDamage(10, this);
        },
        receiveDamage: function (amount, from)
        {
            this.currentAnim = this.anims.jump.rewind();
            this.parent(amount);
        },
        
    });
    
});
