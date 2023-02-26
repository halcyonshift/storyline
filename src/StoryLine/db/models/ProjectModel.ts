import { Model, Q, Query } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { children, date, field, lazy, readonly, text, writer } from '@nozbe/watermelondb/decorators'

import {
    AnnotationDataType,
    CharacterDataType,
    ItemDataType,
    LocationDataType,
    ProjectDataType,
    SectionDataType
} from './types'

import AnnotationModel from './AnnotationModel'
import CharacterModel from './CharacterModel'
import ItemModel from './ItemModel'
import LocationModel from './LocationModel'
import SectionModel from './SectionModel'


export default class ProjectModel extends Model {
    static table = 'project'
    public static associations: Associations = {
        annotation: { type: 'has_many', foreignKey: 'project_id' },
        character: { type: 'has_many', foreignKey: 'project_id' },
        item: { type: 'has_many', foreignKey: 'project_id' },
        location: { type: 'has_many', foreignKey: 'project_id' },
        section: { type: 'has_many', foreignKey: 'project_id' }
    }
    @text('title') title!: string
    @text('author') author!: string
    @text('summary') summary!: string
    @text('language') language!: string
    @field('word_goal') wordGoal!: number
    @date('deadline_at') deadlineAt!: Date
    @date('last_opened_at') lastOpenedAt!: Date
    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date

    @children('annotation') annotation!: Query<AnnotationModel>
    @children('character') character!: Query<CharacterModel>
    @children('item') item!: Query<ItemModel>
    @children('location') location!: Query<LocationModel>
    @children('section') section!: Query<SectionModel>

    @lazy parts = this.section.extend(
        Q.where('mode', 'part'),
        Q.sortBy('order', Q.asc)
    )

    @lazy chapters = this.section.extend(
        Q.where('project_id', this.id),
        Q.where('mode', 'chapter'),
        Q.sortBy('order', Q.asc)
    )

    @lazy fabula = this.section.extend(
        Q.where('project_id', this.id),
        Q.where('mode', 'scene'),
        Q.sortBy('date', Q.asc)
    )

    @lazy mainCharacters = this.character.extend(
        Q.where('mode', 'main'),
        Q.sortBy('display_name', Q.asc)
    )

    @lazy secondaryCharacters = this.character.extend(
        Q.where('mode', 'secondary'),
        Q.sortBy('display_name', Q.asc)
    )

    @lazy annotations = this.annotation.extend(
        Q.sortBy('title', Q.asc)
    )

    @lazy items = this.item.extend(
        Q.sortBy('name', Q.asc)
    )

    @lazy locations = this.location.extend(
        Q.sortBy('name', Q.asc)
    )

    @writer async updateLastOpened() {
        await this.update(project => {
            project.lastOpenedAt = new Date()
        })
    }

    @writer async updateProject(data: ProjectDataType) {
        await this.update(project => {
            project.title = data.title.toString()
            project.author = (data.author || '').toString()
            project.language = data.language
            project.wordGoal = data.wordGoal || null
            project.deadlineAt = data.deadlineAt || null
        })
    }

    @writer async addAnnotation(data: AnnotationDataType) {
        return await this.collections.get<AnnotationModel>('annotation').create(annotation => {
            annotation.project.set(this)
            annotation.title = data.title
            annotation.body = data.body
        })
    }

    @writer async addCharacter(data: CharacterDataType) {
        return await this.collections.get<CharacterModel>('character').create(character => {
            character.project.set(this)
            character.displayName = data.displayName
            character.mode = data.mode
        })
    }

    @writer async addItem(data: ItemDataType) {
        return await this.collections.get<ItemModel>('item').create(item => {
            item.project.set(this)
            item.name = data.name
        })
    }

    @writer async addLocation(data: LocationDataType) {
        return await this.collections.get<LocationModel>('location').create(location => {
            location.project.set(this)
            location.name = data.name
            location.body = data.body
            location.latitude = data.latitude
            location.longitude = data.longitude
            location.url = data.url
            location.image = data.image
        })
    }

    @writer async addPart(data: SectionDataType) {
        // eslint-disable-next-line max-statements
        return await this.collections.get<SectionModel>('section').create(section => {
            section.project.set(this)
            section.title = data.title
            section.description = data.description
            section.body = data.body
            section.date = data.date
            section.order = data.order
            section.words = data.words
            section.mode = 'part'
            section.deadlineAt = data.deadlineAt
        })
    }
}