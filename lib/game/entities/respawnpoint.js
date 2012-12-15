ig.module('game.entities.respawnpoint').requires('impact.entity').defines(function ()
{
    EntityRespawnpoint = ig.Entity.extend(
    {
        size: {
            x: 26,
            y: 26
        },
        offset: {
            x:0,
            y:7
        },
        zIndex: -1,
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
        animSheet: new ig.AnimationSheet('media/sprites/savepoint.png', 26, 26),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.addAnim('idle', 0, [0]);
            this.addAnim('activated', 0, [0]);
            this.addAnim('respawn', 0, [0]);
        },
        update: function ()
        {
            if (this.currentAnim == this.anims.respawn && this.currentAnim.loopCount > 4)
            {
                this.currentAnim = this.anims.activated;
            }
            this.currentAnim.update();
        },
        getSpawnPos: function ()
        {
            return {
                x: (this.pos.x + 11),
                y: this.pos.y
            };
        },
        activate: function ()
        {
            this.active = true;
            ig.game.lastCheckpoint = this;
        },
        check: function (other)
        {
            if (!this.active)
            {
                this.activate();
            }
        }
    });
});