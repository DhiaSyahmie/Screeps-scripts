// JavaScript source code 

module.exports = {
	run: function() {
        var target;
		var tower = Game.getObjectById('5f0890983513bc4000713369');

        if(tower) {
            target = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });

            if(target) {
                tower.repair(target);
                return;
            }

            target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });

            if(target) {
                tower.repair(target);
                return;
            }

            target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                tower.attack(target);
                return;
            }
        } 
	}
}