import * as Yup from 'yup';

import { useEffect, useMemo, useState } from 'react';
import { PropTypes } from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Stack, Paper, Typography, Divider } from '@mui/material';
import { Wrapper } from '@googlemaps/react-wrapper';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import FormProvider from '../../components/hook-form/FormProvider';
import RHFTextField from '../../components/hook-form/RHFTextField';
import { RHFCustomAutoComplete, RHFUploadSingleFile } from '../../components/hook-form';
import { postAttraction, updateAttraction } from '../../services/attraction.service';
import { Map, Marker } from '../../components/map';
import EnvManager from '../../config/envManager';
import LoadingIndicator from '../../components/common/LoadingSpinner';
import { CANTON_OPTIONS, CANTON_LABELS } from '../../utils/constants';
import Iconify from '../../components/common/Iconify';
import RHFUploadMultipleFile from '../../components/hook-form/RHFUploadMultipleFile';

// 1024 * 1024 * 1; // 1MB

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

CreateAttractionForm.propTypes = {
  isDisabled: PropTypes.bool,
  isEdit: PropTypes.bool,
  attraction: PropTypes.object,
};

export function CreateAttractionForm({ isEdit = false, isDisabled = false, attraction }) {
  const navigate = useNavigate();
  const CreateSchema = Yup.object().shape({
    name: Yup.string().required('Attraction name is required'),
    latitude: Yup.number().required('Latitude is required'),
    longitude: Yup.number().required('Longitude is required'),
    longDescription: Yup.string(),
    shortDescription: Yup.string().required('Resume is required'),
    coverImage: Yup.mixed().required('Cover image is required'),
    images: Yup.mixed(),
    cantonName: Yup.string().required('Canton is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: attraction?.name || '',
      latitude: attraction?.latitude || '',
      longitude: attraction?.longitude || '',
      shortDescription: attraction?.short_description || '',
      coverImage: attraction?.cover_image || null,
      images: attraction?.images || [],
      cantonName: attraction?.canton || '',
    }),
    [attraction]
  );

  const methods = useForm({
    resolver: yupResolver(CreateSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
  } = methods;

  const watchCantonName = watch('cantonName');
  const watchLatitude = watch('latitude');
  const watchLongitude = watch('longitude');
  const [position, setPosition] = useState([null]);
  const [restriction, setRestriction] = useState(null);
  const [zoom, setZoom] = useState(15); // initial zoom
  const [center, setCenter] = useState({
    lat: -3.99313,
    lng: -79.20422,
  });

  useEffect(() => {
    reset(defaultValues);
    if (attraction) {
      setPosition({ lat: defaultValues.latitude, lng: defaultValues.longitude });
    } else {
      setPosition(null);
    }
  }, [attraction, defaultValues, reset]);

  useEffect(() => {
    if (watchCantonName) {
      const canton = CANTON_OPTIONS.find((c) => c.label === watchCantonName);
      if (canton?.center && canton?.zoom) {
        setCenter(canton.center);
        setZoom(canton.zoom);
        if (canton.restriction) {
          setRestriction(canton.restriction);
        }
      }

      if (
        attraction?.canton !== watchCantonName ||
        attraction?.latitude !== watchLatitude ||
        attraction?.longitude !== watchLongitude
      ) {
        setValue('latitude', '');
        setValue('longitude', '');
        setPosition(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, watchCantonName]);

  const onClick = (e) => {
    // avoid directly mutating state
    setPosition(e.latLng);
    setValue('latitude', e.latLng.lat());
    setValue('longitude', e.latLng.lng());
  };

  const onIdle = (m) => {
    setZoom(m.getZoom());
    setCenter(m.getCenter().toJSON());
  };

  const render = () => <LoadingIndicator />;

  const onSubmit = async (data) => {
    const response = isEdit ? await updateAttraction({ ...data, id: attraction.id }) : await postAttraction(data);
    const successMessage = isEdit ? 'edited' : 'created';
    const errorMessage = isEdit ? 'editing' : 'creating';
    const navigateTo = isEdit ? `/dashboard/attraction/${attraction.id}/edit` : `/dashboard/attraction/list`;
    if (response.status === 201 || response.status === 200) {
      toast.success(`Attraction ${successMessage} successfully`);
      navigate(navigateTo, { replace: true });
    } else {
      toast.error(`Error ${errorMessage} attraction`);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="name" label="Attraction name" required />
        <Paper elevation={5} rounded sx={{ padding: 2 }}>
          <Stack spacing={3}>
            <Typography variant="subtitle2"> Position</Typography>
            <Typography variant="body2"> Please select the canton and mark the position on the map</Typography>
            <RHFCustomAutoComplete name="cantonName" required label="Canton" options={CANTON_LABELS} />
            {watchCantonName && (
              <>
                <div style={{ display: 'flex', width: '100%', height: '500px' }}>
                  <Wrapper apiKey={EnvManager.GOOGLE_MAP_KEY} render={render}>
                    <Map
                      center={center}
                      onClick={onClick}
                      onIdle={onIdle}
                      zoom={zoom}
                      minZoom={8}
                      maxZoom={22}
                      style={{ flexGrow: '1', height: '100%' }}
                      restriction={restriction}
                    >
                      {position && <Marker key={'marker-lat-long'} position={position} />}
                    </Map>
                  </Wrapper>
                </div>
                <Stack spacing={2} direction="row">
                  <RHFTextField name="latitude" disabled type="number" label="latitude" required />
                  <RHFTextField name="longitude" disabled type="number" label="longitude" required />
                </Stack>
              </>
            )}
          </Stack>
        </Paper>
        <LabelStyle>Description</LabelStyle>
        <RHFTextField
          name="shortDescription"
          multiline
          minRows={6}
          maxRows={8}
          placeholder="Describe the attraction here..."
          required
        />
        <RHFUploadSingleFile name="coverImage" />
        <RHFUploadMultipleFile name="images" label="Add Images" isEdit={isEdit} />
        <Divider />
      </Stack>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: '30px',
        }}
      >
        <LoadingButton
          size="medium"
          sx={{ width: 250 }}
          disabled={isDisabled}
          type="submit"
          variant="contained"
          startIcon={<Iconify icon={'eva:save-outline'} />}
          color={'success'}
          loading={isSubmitting}
        >
          Save changes
        </LoadingButton>
      </div>
    </FormProvider>
  );
}
