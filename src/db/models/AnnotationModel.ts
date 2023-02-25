import { Model, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators'

import CharacterModel from './CharacterModel'
import ItemModel from './ItemModel'
import LocationModel from './LocationModel'
import ProjectModel from './ProjectModel'
import SectionModel from './SectionModel'

export default class AnnotationModel extends Model {
  static table = 'annotation'
  public static associations: Associations = {
    character: { type: 'belongs_to', key: 'character_id' },
    item: { type: 'belongs_to', key: 'item_id' },
    location: { type: 'belongs_to', key: 'location_id' },
    project: { type: 'belongs_to', key: 'project_id' },
    section: { type: 'belongs_to', key: 'section_id' }
  }

  @text('title') title!: string
  @text('body') body!: string
  @text('color') color!: string
  @text('url') url!: string
  @field('image') image!: string
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @relation('character', 'character_id') character!: Relation<CharacterModel>
  @relation('item', 'item_id') item!: Relation<ItemModel>
  @relation('location', 'location_id') location!: Relation<LocationModel>
  @relation('project', 'project_id') project!: Relation<ProjectModel>
  @relation('section', 'section_id') section!: Relation<SectionModel>
}