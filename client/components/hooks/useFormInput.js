import { useState, useCallback } from "react";

function useFormInput(initialState) {
  const [state, setState] = useState(initialState);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleChange = useCallback(e => {
    const { name, value, files } = e.target;

    if (name === "media") {
      if (files?.length > 0) {
        setMedia(files[0]);
        setMediaPreview(URL.createObjectURL(files[0]));
        return;
      }
    }

    setState(prev => ({ ...prev, [name]: value }));
  }, []);

  return {
    state,
    handleChange,
    media,
    setMedia,
    mediaPreview,
    setMediaPreview
  };
}

export default useFormInput;
