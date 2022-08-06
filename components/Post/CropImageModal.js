import React, { useState, useEffect } from "react";
import { Modal, Header, Button, Grid, Icon } from "semantic-ui-react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function CropImageModal({ mediaPreview, setMedia, showModal, setShowModal }) {
  const [cropper, setCropper] = useState();

  const getCropData = () => {
    if (cropper) {
      setMedia(cropper.getCroppedCanvas().toDataURL());
      cropper.destroy();
    }

    setShowModal(false);
  };

  useEffect(() => {
    const handleKeyPress = ({ key }) => {
      if (cropper) {
        if (key === "m") cropper.setDragMode("move");
        if (key === "c") cropper.setDragMode("crop");
        if (key === "r") cropper.reset();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [cropper]);

  return (
    <>
      <Modal
        closeOnDimmerClick={false}
        size="large"
        onClose={() => setShowModal(false)}
        open={showModal}
      >
        <Modal.Header content="Crop image before upload" />

        <Grid columns={2}>
          <Grid.Column>
            <Modal.Content image>
              <Cropper
                style={{ height: "400px", width: "100%" }}
                cropBoxResizable
                zoomable
                highlight
                responsive
                guides
                dragMode="move"
                initialAspectRatio={1}
                preview=".img-preview"
                src={mediaPreview}
                viewMode={1}
                minCropBoxHeight={10}
                minContainerWidth={10}
                background={false}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={cropper => setCropper(cropper)}
              />
            </Modal.Content>
          </Grid.Column>

          <Grid.Column>
            <Modal.Content image>
              <div>
                <Header as="h2">
                  <Icon name="file image outline" />
                  <Header.Content content="Final" />
                </Header>

                <div>
                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      display: "inline-block",
                      padding: "10px",
                      overflow: "hidden",
                      boxSizing: "border-box"
                    }}
                    className="img-preview"
                  />
                </div>
              </div>
            </Modal.Content>
          </Grid.Column>
        </Grid>

        <Modal.Actions>
          <Button
            title="Reset (R)"
            icon="redo"
            circular
            onClick={() => cropper && cropper.reset()}
          />

          <Button
            title="Move Canvas (M)"
            icon="move"
            circular
            onClick={() => cropper && cropper.setDragMode("move")}
          />

          <Button
            title="New Cropbox (C)"
            icon="crop"
            circular
            onClick={() => cropper && cropper.setDragMode("crop")}
          />

          <Button
            negative
            content="Cancel"
            icon="cancel"
            onClick={() => setShowModal(false)}
          />

          <Button
            content="Crop Image"
            icon="checkmark"
            positive
            onClick={getCropData}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default CropImageModal;
