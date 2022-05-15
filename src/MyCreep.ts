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
        // 如果是 harvester，就从占用的 source 减去一个数量
        if (this.creep.memory.role == 'harvester') {
          let sourceHarvesterCount = Memory.sourceHarvesterCount
          let sourceHarvester = sourceHarvesterCount.find((_sourceHarvester) => _sourceHarvester.sourceId == this.creep.memory.sourceId)
          sourceHarvester.count--
        }
        // 如果自己是 upgrader，把自己从 controller Link 占用删掉
        if (this.creep.memory.role == 'upgrader') {
          Memory.controllerLinkCreepCount = Memory.controllerLinkCreepCount.filter((item) => item != this.creep.id)
        }
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