// JavaScript source code
var goToRoom = function (creep, target) {
    var routes = Game.map.findRoute(creep.room, target);

    if (routes.length) {
        creep.moveTo(creep.pos.findClosestByRange(routes[0].exit), {visualizePathStyle: {stroke: '#ff0000'}});
	} 
}

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target;

        if (creep.room.name != Memory.raidLocation) {
            goToRoom(creep, Memory.raidLocation)
            return;
		}

        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            if (creep.attack(target) != OK) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}}); 
			} 
        }
	}
};