class RoleHarvester implements CreepLifeCycle {
  public static instance: CreepLifeCycle = new RoleHarvester()
  public source(creep: Creep, sourceId: Id<Source>) {
    let source: Source;
    if (sourceId) {
      source = Game.getObjectById(sourceId)
    } else {
      let sources = creep.room.find(FIND_SOURCES);
      source = sources[0]
      creep.memory.sourceId = source.id
    }
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) creep.moveTo(source)

    // 自己身上的能量装满了，返回 true（切换至 target 阶段）
    return creep.store.getFreeCapacity() <= 0
  }

  public target(creep: Creep) {
    let container: StructureContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })
    if (container) {
      if (creep.pos.isEqualTo(container.pos)) {
        creep.drop(RESOURCE_ENERGY)
      } else {
        creep.moveTo(container)
      }
    }
    return creep.store[RESOURCE_ENERGY] <= 0
  }
}
export default RoleHarvester