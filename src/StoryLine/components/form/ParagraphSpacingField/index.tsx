import { DEFAULT_PARAGRAPH_SPACING } from '@sl/constants/defaults'
import SliderField from '../SliderField'
import { ParagraphSpacingFieldProps } from './types'

const ParagraphSpacingField = ({ form, name, label }: ParagraphSpacingFieldProps) => (
    <SliderField
        form={form}
        name={name}
        label={label}
        min={2}
        max={10}
        defaultValue={DEFAULT_PARAGRAPH_SPACING}
    />
)

export default ParagraphSpacingField
