import { useDropzone } from "react-dropzone";
import React, { useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineSearch,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import $ from "./../../pages/PlacesPage/PostPlacePage2.module.css";

const ImageUploader = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      const updatedFiles = [...files, ...newFiles].slice(0, 5); // 최대 5개 이미지 제한
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      if (!selectedImage) setSelectedImage(newFiles[0]?.preview);
    },
  });

  const deleteImage = (e, indexToDelete) => {
    e.stopPropagation();
    const newFiles = files.filter((_, i) => i !== indexToDelete);
    setFiles(newFiles);
    onFilesChange(newFiles);
    if (selectedImage === files[indexToDelete].preview) {
      setSelectedImage(newFiles[0]?.preview || null);
    }
  };

  return (
    <section>
      <h3 className={$.sectionTitle}>이미지 선택</h3>
      <div {...getRootProps()} className={$.dropZone}>
        <input {...getInputProps()} />
        {selectedImage ? (
          <img src={selectedImage} className={$.selectedImage} alt="Selected" />
        ) : (
          <div className={$.dropZonePlaceholder}>
            <AiOutlineCloudUpload size={40} />
            <p>
              {isDragActive
                ? "이미지를 여기에 드롭하세요"
                : "클릭 또는 드래그하여 이미지 업로드"}
            </p>
          </div>
        )}
      </div>
      <div className={$.previewContainer}>
        {files.map((file, index) => (
          <div
            key={index}
            className={`${$.imageWrap} ${
              selectedImage === file.preview ? $.selectedBorder : ""
            }`}
            onClick={() => setSelectedImage(file.preview)}
          >
            <button
              type="button"
              onClick={(e) => deleteImage(e, index)}
              className={$.deleteBtn}
            >
              <AiOutlineCloseCircle />
            </button>
            <img src={file.preview} alt="Preview" className={$.imagePreview} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageUploader;
