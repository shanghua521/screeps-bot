class RoleCarrier implements CreepLifeCycle {
  public static instance: CreepLifeCycle = new RoleCarrier()
  public source(creep: Creep, sourceId: Id<Source>) {
    let container: StructureContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    })
    if (container) {
      if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(container)
    } else {
      let sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) creep.moveTo(sources[0])
    }
    // 自己身上的能量装满了，返回 true（切换至 target 阶段）
    return creep.store.getFreeCapacity() <= 0
  }

  public target(creep: Creep) {
    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    });
    let towers = creep.room.find(
      FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    targets.push(...towers)
    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    } else {
      const controller = creep.room.controller
      if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) creep.moveTo(controller)
    }
    // 自己身上的能量没有了，返回 true（切换至 source 阶段）
    return creep.store[RESOURCE_ENERGY] <= 0
  }
}
export default RoleCarrier