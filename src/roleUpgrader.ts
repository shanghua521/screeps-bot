const roleUpgrader = {
  run: function (creep: Creep) {
    if (creep.memory.status == 0) {
      if (creep.store[RESOURCE_ENERGY] != creep.carryCapacity) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
        }
      } else {
        creep.memory.status = 1;
      }
    } else {
      if (creep.store[RESOURCE_ENERGY] != 0) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller);
        }
      } else {
        creep.memory.status = 0;
      }
    }
  }
}

export default roleUpgrader;