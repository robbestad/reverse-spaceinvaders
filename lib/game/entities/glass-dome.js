ig.module('game.entities.glass-dome').requires('impact.entity', 'game.entities.particle').defines(function ()
{
    EntityGlassDome = ig.Entity.extend(
    {
        size: {
            x: 40,
            y: 32
        },
        offset: {
            x: 0,
            y: 0
        },
        health: 80,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.FIXED,
        sfxHit: new ig.Sound('media/sounds/glass-impact.ogg'),
        sfxBreak: new ig.Sound('media/sounds/glass-shatter.ogg'),
        animSheet: new ig.AnimationSheet('media/sprites/glass-dome.png', 40, 32),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 1, [0]);
            this.parent(x, y, settings);
        },
        receiveDamage: function (amount, from)
        {
            if (this.distanceTo(ig.game.player) > 160)
            {
                return;
            }
            this.parent(amount, from);
            this.sfxHit.play();
            for (var i = 0; i < 3; i++)
            {
                ig.game.spawnEntity(EntityGlassShards, from.pos.x, from.pos.y);
            }
        },
        kill: function ()
        {
            this.sfxBreak.play();
            var shards = ig.ua.mobile ? 20 : 100;
            for (var i = 0; i < shards; i++)
            {
                var x = Math.random().map(0, 1, this.pos.x, this.pos.x + this.size.x);
                var y = Math.random().map(0, 1, this.pos.y, this.pos.y + this.size.y);
                ig.game.spawnEntity(EntityGlassShards, x, y);
            }
            this.parent();
        }
    });
    EntityGlassShards = EntityParticle.extend(
    {
        lifetime: 3,
        fadetime: 1,
        bounciness: 0.5,
        vel: {
            x: 60,
            y: 120
        },
        collides: ig.Entity.COLLIDES.NEVER,
        animSheet: new ig.AnimationSheet('media/sprites/glass-shards.png', 4, 4),
        init: function (x, y, settings)
        {
            this.lifetime = Math.random() * 3 + 1;
            this.addAnim('idle', 5, [0, 1, 2, 3]);
            this.parent(x, y, settings);
        }
    });
});