import { filter } from "lodash"

class RoleCarrier implements CreepLifeCycle {
  public static instance: CreepLifeCycle = new RoleCarrier()
  public source(creep: Creep, sourceId: Id<Source>) {
    let container: Structure | Tombstone = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    })
    if (container) {
      if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(container)
    } else {
      let storage = creep.room.storage
      if (storage && storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(storage)
    }
    // 自己身上的能量装满了，返回 true（切换至 target 阶段）
    return creep.store.getFreeCapacity() <= 0
  }

  public target(creep: Creep) {
    let storage = creep.room.storage

    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    });
    // let linkSource = storage.pos.findClosestByRange(FIND_STRUCTURES, {
    //   filter: (structure) => (structure.structureType == STRUCTURE_LINK && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) && structure.cooldown == 0
    // }) as StructureLink
    // if (linkSource) targets.push(linkSource)

    let towers = creep.room.find(
      FIND_MY_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      }
    });
    targets.push(...towers)

    if (storage) targets.push(storage)
    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    }
    // 自己身上的能量没有了，返回 true（切换至 source 阶段）
    return creep.store[RESOURCE_ENERGY] <= 0
  }
}
export default RoleCarrier