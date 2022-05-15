class RoleUpgrader implements CreepLifeCycle {
  public static instance: CreepLifeCycle = new RoleUpgrader()
  public source(creep: Creep, sourceId: Id<Source>) {
    let containerId = creep.memory.currentContainer
    let container: StructureContainer
    let controller = creep.room.controller

    let controllerLinkCreepCount = Memory.controllerLinkCreepCount
    if (controllerLinkCreepCount == undefined) Memory.controllerLinkCreepCount = controllerLinkCreepCount = []
    // 找到 controller 旁边的 link
    let linkSource = Game.getObjectById(Memory.controllerLink)
    // 如果 link 有资源，并且少于三个人用
    if (linkSource) {
      if (controllerLinkCreepCount.indexOf(creep.id) != -1) {
        if (creep.withdraw(linkSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(linkSource)
        return creep.store.getFreeCapacity() <= 0
      } else {
        if (controllerLinkCreepCount.length < 3) {
          if (creep.withdraw(linkSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(linkSource)
          Memory.controllerLinkCreepCount.push(creep.id)
          return creep.store.getFreeCapacity() <= 0
        }
      }
      // 看看自己是否不在用，不在就那就添加进去
    }

    if (containerId) {
      container = Game.getObjectById(containerId) as StructureContainer
      if (container && container.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
        container = controller.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        })
      }
    } else {
      container = controller.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      })
      if (container) creep.memory.currentContainer = container.id
    }
    // container = controller.pos.findClosestByRange(FIND_STRUCTURES, {
    //   filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    // })
    if (container) {
      let currentContainerId = creep.memory.currentContainer
      if (currentContainerId && currentContainerId != container.id) {
        currentContainerId = container.id
      }
      if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(container, { reusePath: 10 })
    } else {
      let storage = creep.room.storage
      if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(storage)
    }
    // 自己身上的能量装满了，返回 true（切换至 target 阶段）
    return creep.store.getFreeCapacity() <= 0
  }

  public target(creep: Creep) {
    const controller = creep.room.controller
    if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) creep.moveTo(controller)

    // 自己身上的能量没有了，返回 true（切换至 source 阶段）
    return creep.store[RESOURCE_ENERGY] <= 0
  }
}
export default RoleUpgrader