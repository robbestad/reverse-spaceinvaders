ig.module('game.entities.fixedcrate').requires('impact.entity', 'game.entities.particle').defines(function ()
{
    EntityFixedcrate = ig.Entity.extend(
    {
        size: {
            x: 8,
            y: 8
        },
        offset: {
            x: 0,
            y: -2
        },
        maxVel: {
            x: 60,
            y: 150
        },
        friction: {
            x: 100,
            y: 0
        },
        health: 5,
        bounciness: 0.4,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.ACTIVE,
        sfxCrack: new ig.Sound('media/sounds/crack.ogg'),
        animSheet: new ig.AnimationSheet('media/sprites/crate.png', 8, 8),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 1, [0]);
            this.parent(x, y, settings);
        },
        kill: function ()
        {
            this.sfxCrack.play();
            var gibs = ig.ua.mobile ? 3 : 10;
            for (var i = 0; i < gibs; i++)
            {
                ig.game.spawnEntity(EntityCrateDebris, this.pos.x, this.pos.y);
            }
            this.parent();
        }
    });
    EntityCrateDebris = EntityParticle.extend(
    {
        lifetime: 2,
        fadetime: 1,
        bounciness: 0.6,
        vel: {
            x: 60,
            y: 120
        },
        animSheet: new ig.AnimationSheet('media/sprites/crate.png', 4, 4),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 5, [2, 3, 6, 7]);
            this.parent(x, y, settings);
        }
    });
});