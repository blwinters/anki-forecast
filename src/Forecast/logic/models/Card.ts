import { v4 as uuid } from 'uuid'

export class Card {
  id: string
  latestInterval: number

  constructor(latestInterval: number) {
    this.id = uuid()
    this.latestInterval = latestInterval
  }
}
