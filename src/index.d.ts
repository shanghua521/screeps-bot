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
}

interface Memory {
  creepConfigs?: {}
}

interface SpawnMemory {
  spawnList: string[]
}