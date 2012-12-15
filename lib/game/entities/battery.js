ig.module('game.entities.battery').requires('impact.entity').defines(function ()
{
    EntityBattery = ig.Entity.extend(
    {
        size: {
            x: 16,
            y: 16
        },
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/sprites/battery.png', 16, 16),
        collect: new ig.Sound('media/sounds/collect.ogg'),
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
            ig.game.laserLeft+=25;
        },
        update: function ()
        {
            this.currentAnim.update();
        }
    });
});