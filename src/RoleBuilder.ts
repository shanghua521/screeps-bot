class RoleBuilder implements CreepLifeCycle {
  public static instance: CreepLifeCycle = new RoleBuilder()
  public source(creep: Creep, sourceId: Id<Source>) {

    let container: StructureContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    })
    if (container) {
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
    let spawn = Game.spawns['Spawn1']
    if (targets.length > 0) {
      targets.sort((a, b) => {
        let aToSpawn = a.pos.getRangeTo(spawn.pos)
        let bToSpawn = b.pos.getRangeTo(spawn.pos)
        return aToSpawn - bToSpawn
      })
      if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    } else {
      // let targets = creep.room.find(FIND_STRUCTURES, {
      //   filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL
      // });

      // targets.sort((a, b) => a.hits - b.hits);
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