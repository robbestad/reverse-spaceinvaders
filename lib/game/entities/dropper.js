ig.module('game.entities.dropper').requires('impact.entity', 'game.entities.particle', 'game.entities.blob').defines(function ()
{
    EntityDropper = ig.Entity.extend(
    {
        size: {
            x: 14,
            y: 8
        },
        offset: {
            x: 1,
            y: 0
        },
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
        health: 80,
        shootTimer: null,
        shootWaitTimer: null,
        canShoot: false,
        animSheet: new ig.AnimationSheet('media/sprites/dropper.png', 16, 8),
        sfxHit: new ig.Sound('media/sounds/wetgib.ogg'),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.shootWaitTimer = new ig.Timer(1);
            this.shootTimer = new ig.Timer(10);
            this.addAnim('idle', 1, [0]);
            this.addAnim('shoot', 0.2, [1, 2, 2, 1]);
            this.addAnim('hit', 0.2, [3]);
        },
        update: function ()
        {
            if (this.currentAnim == this.anims.hit && this.currentAnim.loopCount)
            {
                this.currentAnim = this.anims.idle;
                this.shootWaitTimer.set(0.5);
            }
            else if (this.currentAnim == this.anims.idle && this.shootWaitTimer.delta() > 0 && this.distanceTo(ig.game.player) < 128)
            {
                this.currentAnim = this.anims.shoot.rewind();
                this.shootTimer.set(0.8);
                this.canShoot = true;
            }
            else if (this.currentAnim == this.anims.shoot && this.canShoot && this.shootTimer.delta() > 0)
            {
                this.canShoot = false;
                ig.game.spawnEntity(EntityDropperShot, this.pos.x + 5, this.pos.y + 6);
            }
            if (this.currentAnim == this.anims.shoot && this.currentAnim.loopCount)
            {
                this.currentAnim = this.anims.idle.rewind();
                this.shootWaitTimer.set(0.5);
            }
            this.currentAnim.update();
        },
        kill: function ()
        {
            this.spawnGibs(20);
            this.parent();
        },
        check: function (other)
        {
            other.receiveDamage(10, this);
        },
        receiveDamage: function (amount, from)
        {
            this.currentAnim = this.anims.hit.rewind();
            this.parent(amount);
            this.spawnGibs(3);
            this.sfxHit.play();
        },
        spawnGibs: function (amount)
        {
            var cx = this.pos.x + this.size.x / 2;
            var cy = this.pos.y + this.size.y / 2;
            for (var i = 0; i < amount; i++)
            {
                ig.game.spawnEntity(EntityDropperGib, cx, cy);
            }
        }
    });
    EntityDropperShot = ig.Entity.extend(
    {
        size: {
            x: 4,
            y: 4
        },
        offset: {
            x: 2,
            y: 4
        },
        vel: {
            x: 0,
            y: 0
        },
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.LITE,
        animSheet: new ig.AnimationSheet('media/sprites/dropper.png', 8, 8),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 0.1, [8]);
            this.addAnim('drop', 0.1, [9, 10, 11], true);
            this.parent(x, y, settings);
        },
        update: function ()
        {
            if (this.currentAnim == this.anims.drop && this.currentAnim.loopCount)
            {
                this.kill();
            }
            this.parent();
        },
        handleMovementTrace: function (res)
        {
            this.parent(res);
            if ((res.collision.x || res.collision.y) && this.currentAnim != this.anims.drop)
            {
                this.currentAnim = this.anims.drop.rewind();
            }
        },
        check: function (other)
        {
            if (this.currentAnim != this.anims.drop)
            {
                other.receiveDamage(10, this);
                this.kill();
            }
        }
    });
    EntityDropperGib = EntityParticle.extend(
    {
        lifetime: 3,
        fadetime: 6,
        friction: {
            x: 0,
            y: 0
        },
        vel: {
            x: 60,
            y: 150
        },
        animSheet: new ig.AnimationSheet('media/sprites/blob-gibs.png', 4, 4),
        init: function (x, y, settings)
        {
            this.addAnim('idle', 0.1, [0, 1, 2]);
            this.parent(x, y, settings);
        }
    });
});
