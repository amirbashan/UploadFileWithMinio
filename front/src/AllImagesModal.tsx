import { Box, Modal } from "@mui/material";
import React from "react";
interface IAllImagesModal {
  isClickShowMore: boolean;
  setIsClickShowMore: Function;
  imagesUrl: string[] | undefined;
  handleToChooseImageFromAllImages: Function;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: "65%",
  bgcolor: "#fff",
  border: "2px solid #000",
  boxShadow: 1,
  overflowY: "scroll",
  overflowX: "hidden",
  p: 4,
};
const AllImagesModal = ({
  isClickShowMore,
  setIsClickShowMore,
  imagesUrl,
  handleToChooseImageFromAllImages,
}: IAllImagesModal) => {
  console.log(imagesUrl);
  return (
    <Modal open={isClickShowMore} onClose={() => setIsClickShowMore(false)}>
      <Box sx={style}>
        <div
          style={{
            width: "25rem",
            display: "flex",
            flexDirection: "row",
            boxSizing: "border-box",
            flexWrap: "wrap",
          }}
        >
          {imagesUrl?.length ? (
            imagesUrl?.map((imageUrl, index) => (
              <div
                style={{
                  cursor: "pointer",
                  border: "2px solid black",
                  marginBottom: "2vh",
                  margin: "2vh",
                }}
                key={index}
              >
                {imageUrl.includes("<svg") ? (
                  <div
                    style={{ width: "10rem", height: "10rem" }}
                    key={index}
                    onClick={(e) => handleToChooseImageFromAllImages(e)}
                    dangerouslySetInnerHTML={{ __html: imageUrl }}
                  ></div>
                ) : (
                  <img
                    key={index}
                    src={imageUrl}
                    onClick={(e) => handleToChooseImageFromAllImages(e)}
                    style={{ width: "10rem", height: "10rem" }}
                    alt={"NAN"}
                  />
                )}
              </div>
            ))
          ) : (
            <h2>Not Photo Captured</h2>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default AllImagesModal;
