import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router-dom'
import SectionModel from '@sl/db/models/SectionModel'
import { SectionDataType } from '@sl/db/models/types'
import SectionForm from '@sl/forms/Work/Section'
import { getInitialValues } from '@sl/forms/Work/utils'
import { WorkModel } from '@sl/db/models'
import useLayout from '@sl/layouts/Work/useLayout'

const EditSectionView = () => {
    const section = useRouteLoaderData('section') as SectionModel
    const work = useRouteLoaderData('work') as WorkModel
    const initialValues = Object.keys(
        getInitialValues('section', [
            'work_id',
            'section_id',
            'point_of_view_character_id',
            'status'
        ]) as SectionDataType
    ).reduce(
        (o, key) => ({ ...o, [key]: section[key as keyof SectionModel] }),
        {}
    ) as SectionDataType
    const { setBreadcrumbs, setTitle } = useLayout()
    const { t } = useTranslation()

    useEffect(() => {
        section.getBreadcrumbs().then((breadcrumbs) => {
            setTitle(t('layout.work.panel.section.edit'))
            setBreadcrumbs(breadcrumbs)
        })
    }, [section.id])

    return <SectionForm work={work} section={section} initialValues={initialValues} />
}

export default EditSectionView
