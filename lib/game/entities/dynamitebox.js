ig.module('game.entities.dynamitebox').requires('impact.entity').defines(function ()
{
    EntityDynamitebox = ig.Entity.extend(
    {
        size: {
            x: 16,
            y: 16
        },
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/sprites/dynamitebox.png', 16, 16),
        collect: new ig.Sound('media/sounds/collect.*'),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.1, [0]);
            this.currentAnim.gotoRandomFrame();
        },
        check: function (other)
        {
            this.kill();
            this.collect.play();
            ig.game.dynamitesLeft+=6;
        },
        update: function ()
        {
            this.currentAnim.update();
        }
    });
});