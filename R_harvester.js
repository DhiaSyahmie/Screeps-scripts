var doTransfer = function(targets, creep) {
    if (targets.length) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00ff00'}});
            return true;
        }
    }

    return false;
}

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var targets;
        if (creep.memory.harvest && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvest = false;
            creep.say('transfer');
	    }
	    if (!creep.memory.harvest && creep.store.getFreeCapacity() > 0) {
	        creep.memory.harvest = true;
	        creep.say('harvest');
	    }

	    if (creep.memory.harvest) {
            targets = creep.room.find(FIND_SOURCES);
            if(creep.harvest(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }

        else {
            targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) &&
                                                                                     structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}
            });

            if (doTransfer([targets], creep)) {
                return;
            }
             
            targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN) &&
                                                                                     structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}
            });

            if (doTransfer(targets, creep)) {
                return;
            }

        }
	}
};
