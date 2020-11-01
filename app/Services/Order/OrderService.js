'use strict'

class OrderService {
  constructor(model, trx = false) {
    this.model = model
    this.trx = trx
  }

  async syncItems(items) {
    if (!Array.isArray(items)) return false
    await this.model.items().delete(this.trx)
    await this.modeli.items().createMany(items, this.trx)
  }

  async syncUpdateItems(items) {
    const currentItems = await this.model
      .items()
      .whereIn(
        'id',
        items.map((item) => item.id)
      )
      .fetch()

    // delete items that the user no longer wants
    await this.model
      .items()
      .whereNotIn(
        'id',
        items.map((item) => item.id)
      )
      .delete(this.trx)

    // updates values and quantities
    await Promise.all(
      currentItems.rows.map(async (item) => {
        item.fill(items.find((n) => n.id === item.id))
        await item.save(this.trx)
      })
    )
  }
}

module.exports = OrderService
