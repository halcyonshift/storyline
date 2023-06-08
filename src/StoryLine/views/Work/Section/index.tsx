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
        section.getBreadcrumbs(false).then((breadcrumbs) => {
            setTitle(section.displayName)
            setBreadcrumbs(breadcrumbs)
        })
    }, [section.id])

    if (section.isPart) {
        return <PartView section={section} />
    } else if (section.isChapter) {
        return <ChapterView section={section} />
    } else {
        return <SceneView section={section} />
    }
}

export default SectionView
