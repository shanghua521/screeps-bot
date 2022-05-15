export default class RoleHarvester implements CreepLifeCycle {
  public static instance: CreepLifeCycle = new RoleHarvester()
  public source(creep: Creep, sourceId: Id<Source>) {
    // 查询是否有 source，因为一个 Harvester 与一个 source 绑定
    let source: Source;
    // 收收伙伴的墓碑
    let tombstones = creep.pos.findInRange(FIND_TOMBSTONES, 1, { filter: (tombstone) => tombstone.store.getUsedCapacity(RESOURCE_ENERGY) > 0 })
    if (tombstones.length > 0) {
      if (creep.withdraw(tombstones[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(tombstones[0])
        return creep.store.getFreeCapacity() <= 0
      }
    }
    // 伙伴漏的资源
    let droppedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: (droppedResource) => droppedResource.amount > 0 })
    if (droppedResources.length > 0) {
      if (creep.pickup(droppedResources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(droppedResources[0])
        return creep.store.getFreeCapacity() <= 0
      }
    }

    if (sourceId) {
      // 去 source 拿资源
      source = Game.getObjectById(sourceId)
    } else {
      // 如果没有说明是新生儿，查询哪个 source 旁的人少
      let sourceHarvesterCount = Memory.sourceHarvesterCount
      // 如果不是空
      if (sourceHarvesterCount && sourceHarvesterCount.length > 0) {
        let MaxCount = Infinity
        for (let entity of sourceHarvesterCount) {
          let count = entity.count
          if (count < MaxCount) {
            MaxCount = count
            sourceId = entity.sourceId
          }
        }
        creep.memory.sourceId = sourceId
        source = Game.getObjectById(sourceId)
        creep.memory.sourceId = source.id
        let sourceHarvesterIndex = sourceHarvesterCount.findIndex((_sourceHarvester) => _sourceHarvester.sourceId == sourceId)
        sourceHarvesterCount[sourceHarvesterIndex].count++
        Memory.sourceHarvesterCount = sourceHarvesterCount
        // 是空就初始化一次,并获得少的那个人数
      } else {
        let sources = creep.room.find(FIND_SOURCES);
        let harvesters = Object.values(Game.creeps).filter(_creep => _creep.memory.role == 'harvester')
        let sourceHarvesterCount = []
        let MinCount = Infinity
        for (let _source of sources) {
          let tempSourceId = _source.id
          let count = _source.pos.findInRange(harvesters, 5).length
          if (count < MinCount) {
            MinCount = count
            sourceId = tempSourceId
          }
          sourceHarvesterCount.push({ 'sourceId': tempSourceId, 'count': count })
        }

        source = Game.getObjectById(sourceId)
        Memory.sourceHarvesterCount = sourceHarvesterCount
        creep.memory.sourceId = source.id
      }
    }
    let harvest = creep.harvest(source)
    if (harvest == ERR_NOT_IN_RANGE || harvest == ERR_NOT_ENOUGH_RESOURCES) creep.moveTo(source)

    // 自己身上的能量装满了，返回 true（切换至 target 阶段）
    return creep.store.getFreeCapacity() <= 0
  }

  public target(creep: Creep) {
    let source = Game.getObjectById(creep.memory.sourceId)
    if (!source) return creep.store[RESOURCE_ENERGY] <= 0
    let container: StructureContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })
    // 如果 container 不是空
    if (container) {
      if (creep.pos.isEqualTo(container.pos)) {
        creep.drop(RESOURCE_ENERGY)
        if (creep.store[RESOURCE_ENERGY] <= 0) creep.moveTo(source)
      } else {
        creep.moveTo(container, { reusePath: 1 })
      }
    }
    return creep.store[RESOURCE_ENERGY] <= 0
  }
}