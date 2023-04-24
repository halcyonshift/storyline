import {
    Add,
    AddCircle,
    AddPhotoAlternate,
    AddLocationAlt,
    ArrowBack,
    Article,
    Casino,
    ChangeCircleOutlined,
    Clear,
    EditOutlined,
    ExpandMore,
    GroupAdd,
    History,
    LibraryBooks,
    PeopleAlt,
    PersonAddAlt,
    PersonAddAlt1,
    Person,
    PersonOutline,
    PostAdd,
    Queue,
    RestorePage
} from '@mui/icons-material'

export const GLOBAL_ICONS = {
    add: <Add fontSize='inherit' color='inherit' />,
    addImage: <AddPhotoAlternate fontSize='inherit' color='inherit' />,
    back: <ArrowBack fontSize='inherit' color='inherit' />,
    change: <ChangeCircleOutlined fontSize='inherit' color='inherit' />,
    delete: <Clear fontSize='inherit' color='inherit' />,
    edit: <EditOutlined fontSize='inherit' color='inherit' />,
    expand: <ExpandMore fontSize='inherit' color='inherit' />,
    history: <History fontSize='inherit' color='inherit' />,
    random: <Casino fontSize='inherit' color='inherit' />
}

export const CHARACTER_ICONS = {
    addPrimary: <PersonAddAlt1 fontSize='inherit' color='inherit' />,
    addSecondary: <PersonAddAlt fontSize='inherit' color='inherit' />,
    addTertiary: <GroupAdd fontSize='inherit' color='inherit' />,
    primary: <Person fontSize='inherit' color='inherit' />,
    secondary: <PersonOutline fontSize='inherit' color='inherit' />,
    tertiary: <PeopleAlt fontSize='inherit' color='inherit' />
}

export const ITEM_ICONS = {
    add: <AddCircle fontSize='inherit' color='inherit' />
}

export const LOCATION_ICONS = {
    add: <AddLocationAlt fontSize='inherit' color='inherit' />
}

export const NOTE_ICONS = {
    add: <PostAdd fontSize='inherit' color='inherit' />
}

export const SEARCH_ICONS = {
    clear: <Clear fontSize='inherit' color='inherit' />
}

export const SECTION_ICONS = {
    addPart: <Queue fontSize='inherit' color='inherit' />,
    addChapter: <LibraryBooks fontSize='inherit' color='inherit' />,
    addScene: <Article fontSize='inherit' color='inherit' />,
    version: <RestorePage fontSize='inherit' color='inherit' />
}

export default {
    global: GLOBAL_ICONS,
    character: CHARACTER_ICONS,
    item: ITEM_ICONS,
    location: LOCATION_ICONS,
    section: SECTION_ICONS
}
