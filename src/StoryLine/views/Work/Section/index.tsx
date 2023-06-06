import { useEffect } from 'react'
import { useRouteLoaderData } from 'react-router-dom'
import { SectionModel } from '@sl/db/models'
import useLayout from '@sl/layouts/Work/useLayout'
import ChapterView from './Chapter'
import PartView from './Part'
import SceneView from './Scene'

const SectionView = () => {
    const section = useRouteLoaderData('section') as SectionModel
    const { setBreadcrumbs, setTitle } = useLayout()

    useEffect(() => {
        setTitle(section.displayName)
        section.getBreadcrumbs(false).then((breadcrumbs) => setBreadcrumbs(breadcrumbs))
    }, [section.id])

    if (section.isPart) {
        return <PartView />
    } else if (section.isChapter) {
        return <ChapterView />
    } else {
        return <SceneView section={section} />
    }
}

export default SectionView
