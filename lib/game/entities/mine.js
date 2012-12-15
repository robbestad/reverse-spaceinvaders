ig.module('game.entities.mine').requires('impact.entity', 'game.entities.particle').defines(function ()
{
    EntityMine = ig.Entity.extend(
    {
        size: {
            x: 10,
            y: 7
        },
        offset: {
            x: 8,
            y: 6
        },
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
        health: 10,
        animSheet: new ig.AnimationSheet('media/sprites/mine.png', 20, 10),
        sfxExplode: new ig.Sound('media/sounds/mine.ogg', false),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 0.17, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3]);
            this.currentAnim.gotoRandomFrame();
            this.parent(x, y, settings);
        },
        kill: function ()
        {
            for (var i = 0; i < 10; i++)
            {
                ig.game.spawnEntity(EntityMineGib, this.pos.x, this.pos.y);
            }
            this.sfxExplode.play();
            this.parent();
        },
        check: function (other)
        {
            this.kill();
            other.receiveDamage(10, this);
        }
    });
    EntityMineGib = EntityParticle.extend(
    {
        lifetime: 3,
        fadetime: 4,
        friction: {
            x: 0,
            y: 0
        },
        vel: {
            x: 60,
            y: 150
        },
        animSheet: new ig.AnimationSheet('media/sprites/mine.png', 4, 4),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 0.1, [0]);
            this.parent(x, y, settings);
        }
    });
});