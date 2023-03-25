import { Box, Button } from '@mui/material'
import { FormButtonProps } from './types'

const FormButton = ({ label }: FormButtonProps) => (
    <Box className='text-right'>
        <Button type='submit' variant='contained'>
            {label}
        </Button>
    </Box>
)

export default FormButton
