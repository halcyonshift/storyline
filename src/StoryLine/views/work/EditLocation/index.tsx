import { useRouteLoaderData } from 'react-router-dom'
import FormWrapper from '@sl/components/FormWrapper'
import { LocationModel } from '@sl/db/models'
import LocationForm from '@sl/forms/Work/Location'

const EditLocationView = () => {
    const location = useRouteLoaderData('location') as LocationModel

    return (
        <FormWrapper title={location.displayName} model={location}>
            <LocationForm
                location={location}
                initialValues={{
                    name: location.name,
                    body: location.body,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    url: location.url,
                    image: location.image
                }}
            />
        </FormWrapper>
    )
}

export default EditLocationView
