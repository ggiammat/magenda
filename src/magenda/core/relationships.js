

const relationsActions = {
  boardItemRel: {
    add(item, otherItem) {
      item.targetItem = otherItem
    },
    delete(item) {
      item.targetItem = undefined
    }
  },
  encapsulation: {
    add(item, otherItem) {
      item._encapsulated = otherItem
      otherItem.encapsuler = item
    },
    delete(item, otherItem) {
      item._encapsulated = undefined
      if (otherItem) {
        otherItem.encapsuler = undefined
      }
    }
  },
  parent: {
    add(item, otherItem) {

      if (!otherItem.childs) {
        otherItem.childs = []
      }
      otherItem.childs = [item].concat(otherItem.childs)
      item.hasParent = true
    },
    delete(item, otherItem) {
      if(otherItem && otherItem.childs) {
        let index = otherItem.childs.findIndex(ii => ii.id === item.id)
        if (index > -1) {
          otherItem.childs.splice(index, 1)
        }
      }
      item.hasParent = false
    }
  },
  extends: {
    add(item, otherItem) {
      item._extends = otherItem
    },
    delete(item) {
      item._extends = undefined
    }
  }
}

class RelationsTracker {

  _rels = {}

  reset() {
    this._rels = {}
  }

  updateRelations(items, operation, allItems) {
    console.log('UPDATE RELATIONS STARTED')
    if (Array.isArray(items)) {
      items.forEach(i => this._updateItemRelations(i, operation, allItems))
    } else {
      this._updateItemRelations(items, operation, allItems)
    }
    console.log('UPDATE RELATIONS FINISHED')
  }

  _updateItemRelations(item, operation, allItems) {
    if (item.rels && operation === 'delete') {
      item.rels.forEach(r =>
        this._updateDirectRelation(item, r, operation, allItems)
      )
    }
    if (item.rels && operation === 'add') {
      item.rels.forEach(r =>
        this._updateDirectRelation(item, r, operation, allItems)
      )
    }
    this._updateReverseRelations(item, operation, allItems)
  }

  _updateDirectRelation(item, relation, operation, allItems, otherItemArg = undefined) {
    let relationName = relation.name || relation
    let otherItemId = otherItemArg?.id || relation.other
    let otherItemIndex = allItems.findIndex(i => i.id == otherItemId)
    let otherItem = otherItemArg || (otherItemIndex > -1 ? allItems[otherItemIndex] : undefined)
    console.log(`${this._uid} | Updating (op: ${operation}) direct relation ${item.id} --${relationName}--> ${otherItemId}`)

    if (operation == "add") {
      if (otherItem) {
        console.log('OtherItem found. Execute action and track established relation')
        this._getRelationAction(relationName, operation)(item, otherItem)
        this._trackEstablishedRelation(relationName, item, otherItemId)
      } else {
        console.log('OtherItem not found. Tracking a pending relation')
        this._trackPendingRelation(relationName, item, otherItemId)
      }
    }

    if (operation == "delete") {
      //is e and p really necessary?
      let e = this._getTrackedEstablishedRelation(relationName, otherItemId)
      if (e) {
        if (e.find(ee => ee.id === item.id)) {
          console.log('Established relation found. Execute delete action and untrack relation')
          this._getRelationAction(relationName, operation)(item, otherItem)
          this._untrackRelation(relationName, 'established', item, otherItemId)
        }
      }
      let p = this._getTrackedPendingRelation(relationName, otherItemId)
      if (p) {
        if (p.find(ee => ee.id === item.id)) {
          console.log('Pending relation found. Untrack relation')
          this._untrackRelation(relationName, 'pending', item, otherItemId)
        }
      }
    }
  }

  _updateReverseRelations(item, operation, allItems) {
    let otherItemId = typeof item === 'object' ? item.id : item
    let otherItem = typeof item === 'object' ? item : undefined
    for (const relationName in this._rels) {
      if (operation == "add") {
        let e = this._getTrackedPendingRelation(relationName, otherItemId)
        if(e) {
          e.forEach(ee => {
            console.log(`Pending relation found from item ${ee.id} . Execute update relation`)
            this._updateDirectRelation(ee, relationName, operation, allItems, otherItem)
          })
        }
      }
      if (operation == "delete") {
        let e = this._getTrackedEstablishedRelation(relationName, otherItemId)
        if (e) {
          e.forEach(ee => {
            this._updateDirectRelation(ee, relationName, operation, allItems, otherItem)
            this._trackPendingRelation(relationName, ee, otherItemId)
          })
        }
      }
    }
  }

  _getTrackedPendingRelation(relationName, otherItemId) {
    return this._getTrackedRelation(relationName, 'pending', otherItemId)
  }

  _getTrackedEstablishedRelation(relationName, otherItemId) {
    return this._getTrackedRelation(relationName, 'established', otherItemId)
  }

  _getTrackedRelation(relationName, status, otherItemId) {
    return this._rels[relationName]?.[status]?.[otherItemId]
  }

  _trackEstablishedRelation(relationName, item, otherItemId) {
    this._trackRelation(relationName, 'established', item, otherItemId)
    this._untrackRelation(relationName, 'pending', item, otherItemId)
  }

  _untrackRelation(relationName, status, item, otherItemId) {
    let p = this._rels[relationName][status][otherItemId]
    if (p) {
      let x = p.find(i => i.id === item.id)
      p.splice(x, 1)
      if (p.length == 0) {
        delete this._rels[relationName][status][otherItemId]
      }
    }
  }

  _trackRelation(relationName, status, item, otherItemId) {
    if (!this._rels[relationName]) {
      this._rels[relationName] = {established: {}, pending: {}}
    }

    let b = this._rels[relationName][status][otherItemId]
    if (!b) {
      b = []
      this._rels[relationName][status][otherItemId] = b
    }
    b.push(item)
  }

  _trackPendingRelation(relationName, item, otherItem) {
    this._trackRelation(relationName, 'pending', item, otherItem)
  }

  _getRelationAction(relationName, operation) {
    return relationsActions[relationName]?.[operation] || function() {
      console.log(`operation ${operation} NOT FOUND for relation ${relationName}`)
    }
  }

}

const instance = new RelationsTracker()

export default instance
