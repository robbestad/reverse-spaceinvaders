// lib/plugins/webgl-2d.js
ig.module('plugins.webgl-2d')
    .requires('impact.system')
    .defines(
    function()
    {
        ig.System.inject({init:function(canvasId,fps,width,height,scale)
        {
            if(document.location.href.match(/force-canvas-2d/))
            {
                this.parent(canvasId,fps,width,height,scale);return;
            }
            this.fps=fps;
            this.clock=new ig.Timer();
            this.canvas=ig.$(canvasId);
            this.resize(width,height,scale);
            this.getDrawPos = ig.System.drawMode;


            try
            {
                WebGL2D.enable(this.canvas);
                this.context=this.canvas.getContext('webgl-2d');
                console.log('webGL enabled');
            }
            catch(e)
            {
                // clean up in case the webgl2d stuff screws up somehow.
                this.canvas.gl2d = null;
                if  (this.canvas.$getContext != null)
                {
                    this.canvas.getContext = this.canvas.$getContext;
                    this.canvas.$getContext = null;
                }
                // ensure context is correct
                this.context = this.canvas.getContext('2d');

                console.log('webGL not enabled');
            }
        }
    });
});