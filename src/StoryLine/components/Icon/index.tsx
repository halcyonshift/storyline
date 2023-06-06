import {
    AccessTimeOutlined as AccessTime,
    AddOutlined as Add,
    AddCircleOutlined as AddCircle,
    AddPhotoAlternateOutlined as AddPhotoAlternate,
    AddLocationAltOutlined as AddLocationAlt,
    ArrowBackOutlined as ArrowBack,
    ArrowBackIosNewOutlined as ArrowBackIosNew,
    ArrowDownwardOutlined as ArrowDownward,
    ArrowForwardIosOutlined as ArrowForwardIos,
    ArrowUpwardOutlined as ArrowUpward,
    ArticleOutlined as Article,
    BookOutlined as Book,
    BugReportOutlined as BugReport,
    CasinoOutlined as Casino,
    CategoryOutlined as Category,
    ChangeCircleOutlined as ChangeCircle,
    ChatBubbleOutline as ChatBubble,
    ClearOutlined as Clear,
    CloseOutlined as Close,
    CodeOutlined as Code,
    DashboardOutlined as Dashboard,
    DeleteOutlined as Delete,
    DescriptionOutlined as Description,
    EditOutlined as Edit,
    ExpandMoreOutlined as ExpandMore,
    FileOpenOutlined as FileOpen,
    FilterListOutlined as FilterList,
    FormatAlignCenterOutlined as FormatAlignCenter,
    FormatAlignJustifyOutlined as FormatAlignJustify,
    FormatAlignLeftOutlined as FormatAlignLeft,
    FormatAlignRightOutlined as FormatAlignRight,
    FormatBoldOutlined as FormatBold,
    FormatItalicOutlined as FormatItalic,
    FormatListBulletedOutlined as FormatListBulleted,
    FormatListNumberedOutlined as FormatListNumbered,
    FormatStrikethroughOutlined as FormatStrikethrough,
    FormatUnderlinedOutlined as FormatUnderlined,
    GitHub,
    GroupOutlined as Group,
    GroupAddOutlined as GroupAdd,
    HelpCenterOutlined as HelpCenter,
    HistoryOutlined as History,
    HtmlOutlined as Html,
    HubOutlined as Hub,
    ImportExportOutlined as ImportExport,
    InfoOutlined as Info,
    InsightsOutlined as Insights,
    LabelImportantOutlined as LabelImportant,
    LibraryBooksOutlined as LibraryBooks,
    LiveHelpOutlined as LiveHelp,
    LocalOfferOutlined as LocalOffer,
    LocationOnOutlined as LocationOn,
    MenuBookOutlined as MenuBook,
    NotListedLocationOutlined as NotListedLocation,
    PeopleAltOutlined as PeopleAlt,
    Person4Outlined as Person4,
    PersonAddOutlined as PersonAdd,
    PersonAddAltOutlined as PersonAddAlt,
    PersonAddAlt1Outlined as PersonAddAlt1,
    PersonOutlined as Person,
    PictureAsPdfOutlined as PictureAsPdf,
    PostAddOutlined as PostAdd,
    PublishOutlined as Publish,
    QueueOutlined as Queue,
    RedoOutlined as Redo,
    RestorePageOutlined as RestorePage,
    SaveOutlined as Save,
    SearchOutlined as Search,
    SettingsOutlined as Settings,
    SettingsBackupRestoreOutlined as SettingsBackupRestore,
    StickyNote2Outlined as StickyNote2,
    SubjectOutlined as Subject,
    UndoOutlined as Undo,
    UpgradeOutlined as Upgrade,
    VisibilityOutlined as Visibility,
    VisibilityOffOutlined as VisibilityOff
} from '@mui/icons-material'

const components = {
    AccessTime,
    Add,
    AddCircle,
    AddPhotoAlternate,
    AddLocationAlt,
    ArrowBack,
    ArrowBackIosNew,
    ArrowDownward,
    ArrowForwardIos,
    ArrowUpward,
    Article,
    Book,
    BugReport,
    Casino,
    Category,
    ChangeCircle,
    ChatBubble,
    Clear,
    Close,
    Code,
    Dashboard,
    Delete,
    Description,
    Edit,
    ExpandMore,
    FileOpen,
    FilterList,
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
    GitHub,
    Group,
    GroupAdd,
    HelpCenter,
    History,
    Html,
    Hub,
    ImportExport,
    Info,
    Insights,
    LabelImportant,
    LibraryBooks,
    LiveHelp,
    LocationOn,
    LocalOffer,
    MenuBook,
    NotListedLocation,
    PeopleAlt,
    Person4,
    PersonAdd,
    PersonAddAlt,
    PersonAddAlt1,
    Person,
    PictureAsPdf,
    PostAdd,
    Publish,
    Queue,
    Redo,
    RestorePage,
    Save,
    Search,
    Settings,
    SettingsBackupRestore,
    StickyNote2,
    Subject,
    Undo,
    Upgrade,
    Visibility,
    VisibilityOff
}

const Icon = ({ name }: { name: string }) => {
    const MuiIcon = components[name as keyof typeof components]
    return <MuiIcon aria-label={name} fontSize='inherit' color='inherit' />
}

export default Icon
