import {
    AddCircle,
    AddLocationAlt,
    Article,
    ChangeCircle,
    Delete,
    Edit,
    ExpandMore,
    GroupAdd,
    History,
    LibraryBooks,
    PersonAddAlt,
    PersonAddAlt1,
    Queue
} from '@mui/icons-material'

export const GLOBAL_ICONS = {
    change: <ChangeCircle />,
    delete: <Delete />,
    edit: <Edit />,
    expand: <ExpandMore />,
    history: <History />
}

export const CHARACTER_ICONS = {
    addMain: <PersonAddAlt1 />,
    addSecondary: <PersonAddAlt />,
    addTertiary: <GroupAdd />
}

export const ITEM_ICONS = {
    add: <AddCircle />
}

export const LOCATION_ICONS = {
    add: <AddLocationAlt />
}

export const SECTION_ICONS = {
    addPart: <Queue />,
    addChapter: <LibraryBooks />,
    addScene: <Article />
}

export default {
    global: GLOBAL_ICONS,
    character: CHARACTER_ICONS,
    item: ITEM_ICONS,
    location: LOCATION_ICONS,
    section: SECTION_ICONS
}
