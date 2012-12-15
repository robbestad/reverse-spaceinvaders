ig.module('game.entities.krystall').requires('impact.entity').defines(function ()
{
    EntityKrystall = ig.Entity.extend(
    {
        size: {
            x: 16,
            y: 16
        },
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/sprites/krystall_5.png', 16, 16),
        collect: new ig.Sound('media/sounds/collect.ogg'),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.5, [0, 0, 0, 1, 2, 3, 0, 0, 0, 2, 0, 0, 1, 0, 0]);
            this.currentAnim.gotoRandomFrame();
        },
        check: function (other)
        {
            this.kill();
            this.collect.play();
            ig.game.crystalCount++;
            ig.game.score+=5000;
        },
        update: function ()
        {
            this.currentAnim.update();
        }
    });
});