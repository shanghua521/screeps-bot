class RoleBuilder implements CreepLifeCycle {
  public static instance: CreepLifeCycle = new RoleBuilder()
  public source(creep: Creep, sourceId: Id<Source>) {
    let currentContainerId = creep.memory.currentContainer
    let container: StructureContainer
    if (currentContainerId) {
      container = Game.getObjectById(currentContainerId)
    }
    if (!container) {
      let construction = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
      container = construction.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      })
      if (container) creep.memory.currentContainer = container.id
    }
    if (container && container.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
      container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      })
    }
    if (container) {
      if (container.id != creep.memory.currentContainer) creep.memory.currentContainer = container.id
      if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(container)
    } else {
      let source = creep.pos.findClosestByRange(FIND_SOURCES);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) creep.moveTo(source)
    }
    // 自己身上的能量装满了，返回 true（切换至 target 阶段）
    return creep.store.getFreeCapacity() <= 0
  }

  public target(creep: Creep) {
    let targets: ConstructionSite[]
    targets = creep.room.find(FIND_CONSTRUCTION_SITES)
    let container = Game.getObjectById(creep.memory.currentContainer)
    if (targets.length > 0) {
      targets.sort((a, b) => {
        let aToSpawn = a.pos.getRangeTo(container.pos)
        let bToSpawn = b.pos.getRangeTo(container.pos)
        return aToSpawn - bToSpawn
      })
      let currentContainer = Game.getObjectById(creep.memory.currentContainer)
      if (currentContainer) {
        if (currentContainer.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
          let newContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
          })
          if (newContainer) {
            creep.memory.currentContainer = newContainer.id as Id<StructureContainer>
          }
        }
      }
      // 找到距离建筑工地最近的 source
      let current = creep.memory.currentConstructionSite;
      if (current != targets[0].id) {
        creep.memory.currentConstructionSite = targets[0].id
        creep.memory.currentContainer = targets[0].pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        }).id as Id<StructureContainer>
      }
      if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    } else {
      let container: StructureContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_WALL)
      })
      if (container) {
        if (creep.repair(container) == ERR_NOT_IN_RANGE) {
          creep.moveTo(container);
        }
      }
    }
    // 自己身上的能量没有了，返回 true（切换至 source 阶段）
    return creep.store[RESOURCE_ENERGY] <= 0
  }
}
export default RoleBuilder