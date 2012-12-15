ig.module('game.perlin-noise').defines(function ()
{
    PerlinNoise = ig.Class.extend(
    {
        gx: [],
        gy: [],
        p: [],
        size: 256,
        init: function (size)
        {
            this.size = size || 256;
            for (var i = 0; i < this.size; i++)
            {
                this.gx.push(Math.random() * 2 - 1);
                this.gy.push(Math.random() * 2 - 1);
            }
            for (var j = 0; j < this.size; j++)
            {
                this.p.push(j);
            }
            this.p.sort(function ()
            {
                return 0.5 - Math.random()
            });
        },
        noise2: function (x, y)
        {
            var qx0 = x | 0;
            var qx1 = qx0 + 1;
            var tx0 = x - qx0;
            var tx1 = tx0 - 1;
            var qy0 = y | 0;
            var qy1 = qy0 + 1;
            var ty0 = y - qy0;
            var ty1 = ty0 - 1;
            qx0 = qx0 % this.size;
            qx1 = qx1 % this.size;
            qy0 = qy0 % this.size;
            qy1 = qy1 % this.size;
            var q00 = this.p[(qy0 + this.p[qx0]) % this.size];
            var q01 = this.p[(qy0 + this.p[qx1]) % this.size];
            var q10 = this.p[(qy1 + this.p[qx0]) % this.size];
            var q11 = this.p[(qy1 + this.p[qx1]) % this.size];
            var v00 = this.gx[q00] * tx0 + this.gy[q00] * ty0;
            var v01 = this.gx[q01] * tx1 + this.gy[q01] * ty0;
            var v10 = this.gx[q10] * tx0 + this.gy[q10] * ty1;
            var v11 = this.gx[q11] * tx1 + this.gy[q11] * ty1;
            var wx = (3 - 2 * tx0) * tx0 * tx0;
            var v0 = v00 - wx * (v00 - v01);
            var v1 = v10 - wx * (v10 - v11);
            var wy = (3 - 2 * ty0) * ty0 * ty0;
            var v = v0 - wy * (v0 - v1);
            return v;
        }
    });
});