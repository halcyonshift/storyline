import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Status as Options, type StatusType } from '@sl/constants/status'
import { useTranslation } from 'react-i18next'
import { StatusMap } from '@sl/theme/utils'
import { StatusProps } from './types'

const Status = ({ model }: StatusProps) => {
    const { t } = useTranslation()
    const [status, setStatus] = useState<StatusType>(model.status)

    useEffect(() => setStatus(model.status), [model.id])

    return (
        <ButtonGroup size='small' variant='outlined'>
            {Object.keys(Options).map((option: StatusType) => (
                <Button
                    disableElevation
                    sx={{ textTransform: 'capitalize' }}
                    color={option === status ? StatusMap[option] : 'inherit'}
                    variant='contained'
                    key={option}
                    value={option}
                    onClick={() => {
                        model
                            .updateRecord({
                                status: option
                            })
                            .then(() => setStatus(option))
                    }}>
                    {t(`constant.status.${option}`)}
                </Button>
            ))}
        </ButtonGroup>
    )
}

export default Status
