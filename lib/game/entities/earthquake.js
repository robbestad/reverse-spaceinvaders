ig.module('game.entities.earthquake').requires('game.entities.trigger').defines(function ()
{
    EntityEarthquake = ig.Entity.extend(
    {
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(80, 130, 170, 0.7)',
        size: {
            x: 24,
            y: 24
        },
        duration: 2,
        strength: 8,
        screen: {
            x: 0,
            y: 0
        },
        sound: new ig.Sound('media/sounds/earthquake.ogg', false),
        quakeTimer: null,
        init: function (x, y, settings)
        {
            this.quakeTimer = new ig.Timer();
            this.parent(x, y, settings);
        },           
        triggeredBy: function (entity, trigger)
        {
            this.quakeTimer.set(this.duration);
            if (this.sound)
            {
                this.sound.play();
            }
        },
        update: function ()
        {
            var delta = this.quakeTimer.delta();
            if (delta < -0.1)
            {
                var s = this.strength * Math.pow(-delta / this.duration, 2);
                if (s > 0.5)
                {
                    ig.game.screen.x += Math.random().map(0, 1, -s, s);
                    ig.game.screen.y += Math.random().map(0, 1, -s, s);
                }
            }
        }
    });
});