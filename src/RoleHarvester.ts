class RoleHarvester implements CreepLifeCycle {
  public static instance: CreepLifeCycle = new RoleHarvester()
  public source(creep: Creep, sourceId: Id<Source>) {
    let source: Source;
    if (sourceId) {
      source = Game.getObjectById(sourceId)
    } else {
      let sources = creep.room.find(FIND_SOURCES);
      let harvesters = Object.values(Game.creeps).filter(_creep => _creep.memory.role == 'harvester')
      sources = sources.filter(source => source.pos.findInRange(harvesters, 5).length < 3)
      if (sources && sources.length != 0) {
        source = sources[0]
        creep.memory.sourceId = source.id
      }
    }
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) creep.moveTo(source)

    // 自己身上的能量装满了，返回 true（切换至 target 阶段）
    return creep.store.getFreeCapacity() <= 0
  }

  public target(creep: Creep) {
    let source = Game.getObjectById(creep.memory.sourceId)
    if (!source) return creep.store[RESOURCE_ENERGY] <= 0
    let container: StructureContainer = source.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })
    // 如果 container 不是空
    if (container) {
      let currentContainer = creep.memory.currentContainer
      // 判断次 container 是不是上次放入的 container
      if (currentContainer && creep.memory.currentContainer != container.id) {
        // 如果不是则更新 sourceId
        creep.memory.sourceId = container.pos.findClosestByPath(FIND_SOURCES).id
      }

      if (creep.pos.isEqualTo(container.pos)) {
        creep.drop(RESOURCE_ENERGY)
      } else {
        creep.moveTo(container, { reusePath: 1 })
      }
    }
    return creep.store[RESOURCE_ENERGY] <= 0
  }
}
export default RoleHarvester