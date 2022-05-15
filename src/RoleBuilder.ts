class RoleBuilder implements CreepLifeCycle {
  public static instance: CreepLifeCycle = new RoleBuilder()
  public source(creep: Creep, _sourceId: Id<Source>) {
    let currentContainerId = creep.memory.currentContainer
    let container: StructureContainer
    // 找到当前指定的 container 如果不是 null，就使用这个
    if (currentContainerId) {
      container = Game.getObjectById(currentContainerId)
    }
    // 如果获取到的 container 已经不存在了，虽然很小概率，但是可能
    if (!container) {
      // 找到最近的建造工地
      let construction = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
      // 如果有建造工地
      if (construction) {
        // container 就是离建造工地最近的那个
        container = construction.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        })
      } else {
        // 没有建造工地，就去离自己最近的 container
        container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        })
      }
      // 如果找到了一个 container 就更新
      if (container) creep.memory.currentContainer = container.id
    }
    // 当前建造工地是不是没有资源了
    if (container && container.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
      // 没有的话，找到离没有资源的 container 最近的 container
      container = container.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      })
    }
    // 如果有
    if (container) {
      // 查看次建造工地是不是就是当前的 container，不是就更新
      if (container.id != creep.memory.currentContainer) creep.memory.currentContainer = container.id
      // 取资源
      if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(container)
    } else {
      // 一个都不符合要求，找最近的 source，去 source 拿
      let storage = creep.room.storage
      if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(storage)
    }
    // 自己身上的能量装满了，返回 true（切换至 target 阶段）
    return creep.store.getFreeCapacity() <= 0
  }

  public target(creep: Creep) {
    let targets: ConstructionSite[]
    targets = creep.room.find(FIND_CONSTRUCTION_SITES)
    // let container = Game.getObjectById(creep.memory.currentContainer)
    let container = Game.getObjectById(creep.room.storage.id)
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
        let container = targets[0].pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        })
        if (container) creep.memory.currentContainer = container.id as Id<StructureContainer>
      }
      if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    } else {

      let fixTargetId = creep.memory.fixTargetId
      let fixTargetHits = creep.memory.fixTargetHits
      let fixTarget: StructureWall
      if (fixTargetId && Game.getObjectById(fixTargetId).hits < fixTargetHits) {
        fixTarget = Game.getObjectById(fixTargetId)
      } else {
        let container: StructureWall[] = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits < structure.hitsMax
        })
        if (container.length != 0) {
          container = container.sort((a, b) => a.hits - b.hits)
          fixTarget = container[0]
          creep.memory.fixTargetId = fixTarget.id
          if (fixTarget.hitsMax - fixTarget.hits > 1000) {
            creep.memory.fixTargetHits = container[0].hits + 1000
          } else {
            creep.memory.fixTargetHits = fixTarget.hitsMax
          }
        }
      }
      if (container) {
        if (creep.repair(fixTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(fixTarget);
        }
      }
    }
    // 自己身上的能量没有了，返回 true（切换至 source 阶段）
    return creep.store[RESOURCE_ENERGY] <= 0
  }
}
export default RoleBuilder