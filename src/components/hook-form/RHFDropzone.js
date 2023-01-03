import  PropTypes  from 'prop-types';
import { useDropzone } from 'react-dropzone'
import { useFormContext, Controller } from 'react-hook-form';

Dropzone.propTypes = {
  multiple: PropTypes.bool,
  onChange: PropTypes.func, 
}

RHFDropzoneField.propTypes = {
  name: PropTypes.string.isRequired,
  multiple: PropTypes.bool
}


function Dropzone({
  multiple = false,
  onChange,
  ...rest
}) {

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    multiple,
    ...rest,
  })

  
  return (
    <div {...getRootProps()}>
      <input {...getInputProps({ onChange })} />
    </div>
  )
}

export function RHFDropzoneField({
  name,
  multiple = false,
  ...rest
}){
  const { control } = useFormContext()

  return (
    <Controller
      render={({ field: {onChange} }) => (
        <Dropzone
          multiple={multiple}
          onChange={e =>
            onChange(multiple ? e.target.files : e.target.files[0])
          }
          {...rest}
        />
      )}
      name={name}
      control={control}
      defaultValue=''
    />
  )
}