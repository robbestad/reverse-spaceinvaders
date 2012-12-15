ig.module(
	'game.entities.kill'
)
.requires(
	'impact.entity'
)
.defines(function (){
    EntityKill = ig.Entity.extend(
    {
        
       _wmDrawBox: true,
       _wmBoxColor: 'rgba(255,0,0,0.5)',
       _wmScalable: true,
       
        checkAgainst: ig.Entity.TYPE.BOTH,

        update: function (){},
     
     
        check: function (other)
        {
            //other.kill();
            other.receiveDamage(10000, this);
        }
    });
});