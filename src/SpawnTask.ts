class SpawnTask {
  private creepConfigs = [
    {
      role: 'harvester',
      bodys: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      sourceId: null,
      number: 1
    }, {
      role: 'upgrader',
      bodys: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      sourceId: null,
      number: 1
    }, {
      role: 'builder',
      bodys: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
      sourceId: null,
      number: 1
    }, {
      role: 'carrier',
      bodys: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      sourceId: null,
      number: 1
    }
  ]
  private spawn = null
  public constructor() {
    this.spawn = Game.spawns['Spawn1']
    if (this.spawn.memory.spawnList == undefined) {
      this.spawn.memory.spawnList = []
    }
  }

  public work() {
    if (this.spawn.spawning || !this.spawn.memory.spawnList || this.spawn.memory.spawnList.length == 0) return
    const spawnSuccess = this.mainSpawn(this.spawn.memory.spawnList[0])
    if (spawnSuccess) this.spawn.memory.spawnList.shift()
  }

  public addTask(taskName: string) {
    this.spawn.memory.spawnList.push(taskName);
    return this.spawn.memory.spawnList.length;
  }
  // Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], 'Builder1', { memory: { role: 'builder' } });
  public mainSpawn(taskName: string): boolean {
    let creepConfig = this.creepConfigs.find(config => config.role == taskName)
    let index = 0
    let mark = this.spawn.spawnCreep(creepConfig.bodys, `${taskName}${index}`, { memory: { role: taskName, sourceId: creepConfig.sourceId } })
    if (mark == ERR_NOT_ENOUGH_ENERGY) {
      return false
    }
    while (mark == ERR_NAME_EXISTS) {
      index++
      mark = this.spawn.spawnCreep(creepConfig.bodys, `${taskName}${index}`, { memory: { role: taskName, sourceId: creepConfig.sourceId } })
    }
    // while (this.spawn.spawnCreep(creepConfig.bodys, `${taskName}${index}`, { memory: { role: taskName } }) != -3) index++;
    return mark == 0
  }
}
export default SpawnTask