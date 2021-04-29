function move(creep, target, range = 3) {
	if (target) {
		return creep.moveTo(target, {
			visualizePathStyle: { stroke: '#0000ff' },
			range: range,
			maxOps: 100,
			reusePath: Math.floor(Math.random() * 10) + 1
		});
	}
}

function build(creep, target) {
	if (target) {
		let res = creep.build(target);
		if (res == ERR_NOT_IN_RANGE) {
			move(creep, target, 3)
		}
		return true
	}
	return false
}

function doRole(creep) {
	if (creep.getActiveBodyparts(WORK) == 0) {
		creep.suicide()
		return
	}

	if (creep.memory.mode == 1 && creep.room.name != Memory.roomTarget) {
		if (Game.rooms[Memory.roomTarget]) {
			move(creep, Game.rooms[Memory.roomTarget].controller, 1)
			return;
		}
	}

	if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
		creep.memory.building = false;
		creep.say('harvest');
	}
	if (!creep.memory.building && creep.store.getFreeCapacity() < HARVEST_POWER * creep.getActiveBodyparts(WORK)) {
		creep.memory.building = true;
		creep.say('build');
	}

	if (creep.memory.building && creep.store[RESOURCE_ENERGY] > 0) {
		if (build(creep, creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
			filter: { structureType: STRUCTURE_SPAWN }
		}))) { return }

		if (build(creep, creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
			filter: { structureType: STRUCTURE_TOWER }
		}))) { return }

		if (build(creep, creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
			filter: { structureType: STRUCTURE_WALL }
		}))) { return }

		if (build(creep, creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
			filter: { structureType: STRUCTURE_RAMPART }
		}))) { return }

		if (build(creep, creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES))) {
			return
		}

		if (creep.room.controller) {
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				move(creep, creep.room.controller, 1)
			}
			return;
		}
	}

	let sources = creep.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER &&
			structure.store[RESOURCE_ENERGY] > 1000)
	});
	if (sources) {
		if (creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			move(creep, sources, 1)
			return;
		}
	}

	sources = creep.room.find(FIND_SOURCES_ACTIVE);
	if (sources.length) {
		var target = sources[sources.length - 1];
		if (creep.harvest(target) != OK) {
			move(creep, target, 1)
		}
	}

}

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		doRole(creep);
	}
};