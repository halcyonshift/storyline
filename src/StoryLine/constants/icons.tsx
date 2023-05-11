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
    FormatAlignCenter,
    FormatAlignJustify,
    FormatAlignLeft,
    FormatAlignRight,
    FormatBold,
    FormatItalic,
    FormatListBulleted,
    FormatListNumbered,
    FormatStrikethrough,
    FormatUnderlined,
    GroupAdd,
    History,
    LabelImportant,
    LibraryBooks,
    LocalOffer,
    PeopleAlt,
    PersonAddAlt,
    PersonAddAlt1,
    Person,
    PersonOutline,
    PostAdd,
    Queue,
    Redo,
    RestorePage,
    Save,
    Search,
    Undo
} from '@mui/icons-material'

const components = {
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
    FormatAlignCenter,
    FormatAlignJustify,
    FormatAlignLeft,
    FormatAlignRight,
    FormatBold,
    FormatItalic,
    FormatListBulleted,
    FormatListNumbered,
    FormatStrikethrough,
    FormatUnderlined,
    GroupAdd,
    History,
    LabelImportant,
    LibraryBooks,
    LocalOffer,
    PeopleAlt,
    PersonAddAlt,
    PersonAddAlt1,
    Person,
    PersonOutline,
    PostAdd,
    Queue,
    Redo,
    RestorePage,
    Save,
    Search,
    Undo
}

const Icon = ({ name }: { name: string }) => {
    const MuiIcon = components[name as keyof typeof components]
    return <MuiIcon fontSize='inherit' color='inherit' />
}

export const GLOBAL_ICONS = {
    add: <Icon name='Add' />,
    addImage: <Icon name='AddPhotoAlternate' />,
    back: <Icon name='ArrowBack' />,
    change: <Icon name='ChangeCircleOutlined' />,
    delete: <Icon name='Clear' />,
    edit: <Icon name='EditOutlined' />,
    expand: <Icon name='ExpandMore' />,
    history: <Icon name='History' />,
    random: <Icon name='Casino' />
}

export const CHARACTER_ICONS = {
    addPrimary: <Icon name='PersonAddAlt1' />,
    addSecondary: <Icon name='PersonAddAlt' />,
    addTertiary: <Icon name='GroupAdd' />,
    primary: <Icon name='Person' />,
    secondary: <Icon name='PersonOutline' />,
    tertiary: <Icon name='PeopleAlt' />
}

export const ITEM_ICONS = {
    add: <Icon name='AddCircle' />
}

export const LOCATION_ICONS = {
    add: <Icon name='AddLocationAlt' />
}

export const NOTE_ICONS = {
    add: <Icon name='PostAdd' />
}

export const RICHTEXT_ICONS = {
    bold: <Icon name='FormatBold' />,
    italic: <Icon name='FormatItalic' />,
    ul: <Icon name='FormatListBulleted' />,
    ol: <Icon name='FormatListNumbered' />,
    strike: <Icon name='FormatStrikethrough' />,
    underline: <Icon name='FormatUnderlined' />,
    alignLeft: <Icon name='FormatAlignLeft' />,
    alignRight: <Icon name='FormatAlignRight' />,
    alignCenter: <Icon name='FormatAlignCenter' />,
    alignJustify: <Icon name='FormatAlignJustify' />,
    tag: <Icon name='LocalOffer' />,
    version: <Icon name='RestorePage' />,
    redo: <Icon name='Redo' />,
    undo: <Icon name='Undo' />,
    save: <Icon name='Save' />,
    search: <Icon name='Search' />,
    excerpt: <Icon name='LabelImportant' />
}

export const SEARCH_ICONS = {
    clear: <Icon name='Clear' />
}

export const SECTION_ICONS = {
    addPart: <Icon name='Queue' />,
    addChapter: <Icon name='LibraryBooks' />,
    addScene: <Icon name='PeopleAlt' />,
    version: <Icon name='RestorePage' />
}

export default {
    global: GLOBAL_ICONS,
    character: CHARACTER_ICONS,
    item: ITEM_ICONS,
    location: LOCATION_ICONS,
    section: SECTION_ICONS
}
