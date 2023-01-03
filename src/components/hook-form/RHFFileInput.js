import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

FileInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  accept: PropTypes.object,
  multiple: PropTypes.bool
};

/* const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
}; */

function FileInput(props) {
  const { name, label = name, multiple = false } = props;
  const { register, unregister, setValue, watch } = useFormContext();
  const files = watch(name);
  const onDrop = useCallback(
    (droppedFiles) => {
      setValue(name, droppedFiles, { shouldValidate: true });
    },
    [setValue, name]
  );

  // const onDrop = useCallback(
  //   (droppedFiles) => {
  //     const newFiles = (!!files?.length && [...files].concat(droppedFiles)) || droppedFiles;
  //     setValue(name, newFiles, { shouldValidate: true });
  //   },
  //   [setValue, name, files]
  // );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: props.accept,
    multiple
  });
  useEffect(() => {
    register(name);
    return () => {
      unregister(name);
    };
  }, [register, unregister, name]);

  return (
    <>
      <label className="MuiInputLabel-root MuiInputLabel-animated"  htmlFor={name}>
        {label}
      </label>
      <div {...getRootProps({className: 'dropzone'})} type="file" role="button" aria-label="File Upload" id={name}>
        <input {...props} {...getInputProps()} />
          <p className=" ">Drop the files here ...</p>

          {!!files?.length && (
            <div>
              {files.map((file) => (
                <div key={file.name}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{
                      maxHeight:'250px'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        
      </div>
    </>
  );
}

export default FileInput;
