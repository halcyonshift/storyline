import ChapterSummary from './Chapter'
import PartSummary from './Part'
import SceneSummary from './Scene'

import { SummaryProps } from './types'

const Summary = ({ parts, chapters, scenes }: SummaryProps) => {
    {
        parts.length > 1 ? (
            <PartSummary parts={parts} chapters={chapters} scenes={scenes} />
        ) : chapters.length > 1 ? (
            <ChapterSummary chapters={chapters} scenes={scenes} />
        ) : (
            <SceneSummary scenes={scenes} />
        )
    }
}
