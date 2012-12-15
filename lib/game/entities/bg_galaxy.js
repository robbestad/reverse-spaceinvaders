ig.module('game.entities.bg_galaxy').requires('impact.entity').defines(function ()
{
    EntityBg_galaxy = ig.Entity.extend(
    {
        size: {
            x: 518,
            y: 518
        },
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/vw/bg_galaxy.png', 518, 518),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.1, [0]);
            this.currentAnim.gotoRandomFrame();
        },
        check: function (other)
        {
        //    this.kill();
        //    ig.game.dynamitesLeft+=6;
        },
        update: function ()
        {
            this.currentAnim.update();
        }
    });
});