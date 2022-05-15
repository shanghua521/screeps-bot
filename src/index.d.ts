interface CreepMemory {
  /**
   * 该 creep 的角色
   */
  role?: string
  /**
   * 状态
   */
  status?: number

  working?: Boolean

  sourceId?: Id<Source>

  // 是否已发送健康信息
  hasSendRebirth?: Boolean

  currentConstructionSite?: Id<ConstructionSite>

  currentContainer?: Id<StructureContainer>

  fixTargetHits?: number,

  fixTargetId: Id<StructureWall>
}

interface Memory {
  /**
* 该 creep 的角色
*/
  creepConfigs?: {}

  sourceHarvesterCount?: SourceHarvesterCount[]

  storageLink?: Id<StructureLink>

  controllerLink?: Id<StructureLink>

  // controller 旁的 link 有多少人用
  controllerLinkCreepCount?: Id<Creep>[]
}

interface SpawnMemory {
  spawnList: string[]
}

interface SourceHarvesterCount {
  sourceId: Id<Source>,
  count: number
}