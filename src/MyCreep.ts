import SpawnTask from './SpawnTask'
class MyCreep {
  private readonly creep: Creep
  private stateChange = true
  public creepLogic: CreepLifeCycle
  public sourceId: Id<Source>
  public role: string

  constructor(creep: Creep) {
    this.creep = creep
    this.role = creep.memory.role
    this.sourceId = creep.memory.sourceId
  }

  public work() {
    if (this.creep.memory.working) {
      if (this.creepLogic.target) this.stateChange = this.creepLogic.target(this.creep)
    } else {
      if (this.creepLogic.source) this.stateChange = this.creepLogic.source(this.creep, this.sourceId)
    }
    // 状态变化了就切换状态
    if (this.stateChange) this.creep.memory.working = !this.creep.memory.working

    // 如果没检查过健康信息
    if (!this.creep.memory.hasSendRebirth) {
      const health = this.isHealthy()
      if (!health) {
        // 指定任务
        new SpawnTask().addTask(this.creep.memory.role)
        this.creep.memory.hasSendRebirth = true
      }
    }
  }

  public isHealthy() {
    if (this.creep.ticksToLive <= 10) return false
    else return true
  }
}
export default MyCreep