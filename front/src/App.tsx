import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { Button, CircularProgress, IconButton, styled } from "@mui/material";
import axios from "axios";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import AllImagesModal from "./AllImagesModal";

const StyledIconButton = styled(IconButton)({
  "&:focus": {
    outline: "none",
  },
});

function App() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [imagesUrl, setImagesUrl] = useState<Array<string>>();
  const [isClickShowMore, setIsClickShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await axios.get("http://localhost:3002/getImages");
      console.log(data);
      setImagesUrl(data);
    };
    fetchImages();
  }, [setUploadedFile]);
  const handleOnChane = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (e?.target?.files) {
        setIsLoading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        await axios.post("http://localhost:3002/uploadImage", formData);
        console.log("Upload Successes");
        const imageByName = await axios.get(
          "http://localhost:3002/getImageByName",
          {
            data: { name: file.name },
            params: { name: file.name },
          },
        );
        const urlOfImage = imageByName.data;
        setIsLoading(false);
        setUploadedFile(urlOfImage);
      }
    } catch (error) {
      console.error("Error uploading file to MinIO:", error);
    }
  };
  console.log("uploadedFile", uploadedFile);

  const handleToChooseImageFromAllImages = (e: any) => {
    setUploadedFile(e.target.src);
    setIsClickShowMore(false);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Button variant="contained" component="label">
        Upload Image
        <input
          type="file"
          hidden
          onChange={(e) => handleOnChane(e)}
          accept="image/*"
        />
      </Button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          boxSizing: "border-box",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            minWidth: "7vw",
          }}
        >
          All Images
        </h2>
        <StyledIconButton onClick={() => setIsClickShowMore(!isClickShowMore)}>
          {!isClickShowMore && <CollectionsBookmarkIcon />}
        </StyledIconButton>
      </div>
      {isClickShowMore && (
        <AllImagesModal
          handleToChooseImageFromAllImages={handleToChooseImageFromAllImages}
          imagesUrl={imagesUrl}
          isClickShowMore={isClickShowMore}
          setIsClickShowMore={setIsClickShowMore}
        />
      )}
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </div>
      )}
      {uploadedFile && (
        <div
          style={{
            width: "22vw",
            height: "37vh",
            display: "flex",
            border: "2px #999 dashed",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "5vh",
          }}
        >
          <h3>Selected Image</h3>
          <img
            src={uploadedFile}
            style={{ width: "18vw", height: "22vh" }}
            alt={"UploadFile"}
          />
        </div>
      )}
    </div>
  );
}

export default App;
