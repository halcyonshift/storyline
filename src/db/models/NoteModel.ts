import { Model, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators'

import CharacterModel from './CharacterModel'
import ItemModel from './ItemModel'
import LocationModel from './LocationModel'


export default class NoteModel extends Model {
  static table = 'note'
  public static associations: Associations = {
    character: { type: 'belongs_to', key: 'character_id' },
    item: { type: 'belongs_to', key: 'item_id' },
    location: { type: 'belongs_to', key: 'location_id' }
  }

  @text('title') name!: string
  @text('body') body!: string
  @date('date') date!: string
  @text('url') url!: string
  @field('image') image!: string
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @relation('character', 'character_id') project!: Relation<CharacterModel>
  @relation('item', 'item_id') item!: Relation<ItemModel>
  @relation('location', 'location_id') location!: Relation<LocationModel>
}