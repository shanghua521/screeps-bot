import { filter } from "lodash"

class RoleCarrier2 implements CreepLifeCycle {
  public static instance: CreepLifeCycle = new RoleCarrier2()
  public source(creep: Creep, sourceId: Id<Source>) {
    let allSource = this.getAllResource(creep.room)
    let source = creep.pos.findClosestByPath(allSource)
    if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(source)
    return creep.store.getFreeCapacity() <= 0
  }

  public target(creep: Creep) {
    let allTarget = this.getAllTarget(creep.room)
    let target: any
    if (allTarget.length != 0) {
      target = creep.pos.findClosestByPath(allTarget)
    } else {
      target = creep.room.storage
    }
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target)
    // 自己身上的能量没有了，返回 true（切换至 source 阶段）
    return creep.store[RESOURCE_ENERGY] <= 0
  }

  private getAllResource(room: Room) {
    let allSource: any[] = []
    let storage = room.storage
    // 所有有资源的 container
    let containers = room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    }) as StructureContainer[]
    // 所有的墓碑
    let tombstones = room.find(FIND_TOMBSTONES, {
      filter: (tombstone) => tombstone.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    })
    // 所有地上的资源，地上的资源需要 pickup 方法不一样，暂时不处理
    // let droppedResources = room.find(FIND_DROPPED_RESOURCES, {
    //   filter: (droppedResource) => droppedResource.amount > 0
    // })
    if (storage) allSource.push(storage)
    allSource.push(...containers)
    allSource.push(...tombstones)

    // allSource.push(...droppedResources)
    return allSource
  }

  private getAllTarget(room: Room) {
    let allTarget = []
    // 找到所有的 spawn
    let spawns = room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
      }
    })
    // 找到所有的 extensions
    let extensions = room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
      }
    })
    // 所有的 towers
    let towers = room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
      }
    })
    // storage 旁边的 link 也要填满
    let storageLinkId = Memory.storageLink
    let storageLink: StructureLink
    if (storageLinkId && (storageLink = Game.getObjectById(storageLinkId))) {
      if (storageLink.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        allTarget.push(storageLink)
      }
    }
    allTarget.push(...towers)
    allTarget.push(...spawns)
    allTarget.push(...extensions)
    return allTarget
  }
}
export default RoleCarrier2