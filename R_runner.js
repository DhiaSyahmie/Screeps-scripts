// JavaScript source code
var doTransfer = function(targets, creep) {
	if (targets.length) {
		if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
			creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffeeee'}});  
			return true;
		} 
	}
	return false;
}

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
		var targets;

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('pass');
	    }

	    if(creep.memory.building) { 
			targets = creep.room.find(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_SPAWN && 
																						   targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;}

			targets = creep.room.find(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_TOWER && 
																						   targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;}

			targets = creep.room.find(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_EXTENSION && 
																						   targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;} 
			 
			targets = creep.room.find(FIND_MY_CREEPS, {filter: (targets) => {return (targets.memory.role == 'builder' && 
																						 targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;} 

			targets = creep.room.find(FIND_MY_CREEPS, {filter: (targets) => {return (targets.memory.role == 'repairer' && 
																						 targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;} 
	    }
	    else { 
			targets = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
			if(targets) {
				if(creep.pickup(targets) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets);
				}
			} 

			targets = creep.pos.findClosestByRange(FIND_RUINS, {filter: (targets) => { return (targets.store[RESOURCE_ENERGY] != 0)}});
			if(targets) {
				if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff0022'}});
					return;
				}
			} 

			targets = creep.room.find(FIND_TOMBSTONES, {filter: (targets) => { return (targets.store[RESOURCE_ENERGY] != 0)}});
			if (targets.length) {
				if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff0022'}});
					return;
				}
			} 

			targets = creep.room.find(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_CONTAINER && 
																						   targets.store[RESOURCE_ENERGY] != 0)}});
			if (targets.length) {
				if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff0022'}});
					return;
				}
			} 
	    }
	}
};