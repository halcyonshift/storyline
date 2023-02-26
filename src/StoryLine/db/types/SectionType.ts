type SectionType = {
    title: string
    mode?: 'chapter' | 'scene' | 'part' | 'revision'
    body?: string
    description?: string
    date?: string
    words?: number
    order?: number
    deadlineAt?: Date
}

export default SectionType