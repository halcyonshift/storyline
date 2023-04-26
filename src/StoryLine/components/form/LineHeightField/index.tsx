import RadioField from '../RadioField'
import { LineHeightFieldProps } from './types'

const LineHeightField = ({ form, name, label }: LineHeightFieldProps) => (
    <RadioField
        form={form}
        name={name}
        label={label}
        options={[
            { value: 'normal', label: 'component.lineHeight.normal' },
            { value: 'relaxed', label: 'component.lineHeight.relaxed' },
            { value: 'loose', label: 'component.lineHeight.loose' }
        ]}
    />
)

export default LineHeightField
