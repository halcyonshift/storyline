import ChapterSummary from './Chapter'
import PartSummary from './Part'
import SceneSummary from './Scene'
import { OverviewSummaryProps } from '../types'

const Summary = ({ parts, chapters, scenes }: OverviewSummaryProps) => {
    if (parts.length) return <PartSummary parts={parts} chapters={chapters} scenes={scenes} />
    if (chapters.length > 1) return <ChapterSummary chapters={chapters} scenes={scenes} />
    return <SceneSummary scenes={scenes} />
}

export default Summary
