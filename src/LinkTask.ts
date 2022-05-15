export class LinkTask {
  private storageLink: StructureLink
  private controllerLink: StructureLink
  constructor() {
    this.init()
    this.storageLink = Game.getObjectById(Memory.storageLink)
    this.controllerLink = Game.getObjectById(Memory.controllerLink)
  }

  private init() {
    let storageLink = Memory.storageLink
    let controllerLink = Memory.controllerLink
    if (!storageLink) {
      Memory.storageLink = Game.rooms['W28S22'].storage.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_LINK
      }).id as Id<StructureLink>
    }
    if (!controllerLink) {
      Memory.controllerLink = Game.rooms['W28S22'].controller.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_LINK
      }).id as Id<StructureLink>
    }
  }

  public work() {
    if (this.storageLink.cooldown == 0 && this.storageLink.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && this.controllerLink.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      this.sendSourceToControllerLink()
    }
  }

  public sendSourceToControllerLink() {
    this.storageLink.transferEnergy(this.controllerLink)
  }
}