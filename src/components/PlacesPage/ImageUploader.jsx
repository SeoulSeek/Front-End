import { useDropzone } from "react-dropzone";
import React, { useState, useEffect, useCallback } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineSearch,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import $ from "./../../pages/PlacesPage/PostPlacePage2.module.css";

const ImageUploader = ({
  onFilesChange,
  initialFiles = [],
  onInitialImageDelete,
}) => {
  // File 객체 (새로 추가된 것만)
  const [addedFiles, setAddedFiles] = useState([]);
  // 모든 미리보기 URL (초기 + 새로 추가된 것)
  const [previews, setPreviews] = useState(initialFiles);
  // 선택된 미리보기 URL
  const [selectedPreview, setSelectedPreview] = useState(
    initialFiles[0] || null
  );

  const notifyParent = useCallback(
    (updatedAddedFiles) => {
      onFilesChange(updatedAddedFiles);
    },
    [onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    onDrop: (acceptedFiles) => {
      const newFileObjects = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      const newPreviews = newFileObjects.map((f) => f.preview);
      const updatedPreviews = [...previews, ...newPreviews].slice(0, 5); // 최대 5개
      const updatedAddedFiles = [...addedFiles, ...newFileObjects].slice(0, 5);

      setPreviews(updatedPreviews);
      setAddedFiles(updatedAddedFiles);
      notifyParent(updatedAddedFiles); // File 객체만 부모로 전달

      if (!selectedPreview && newFileObjects.length > 0) {
        // selectedPreview가 없을 때만 자동 선택
        setSelectedPreview(newFileObjects[0].preview);
      }
    },
  });

  const deleteImage = (e, indexToDelete) => {
    e.stopPropagation();
    const previewToDelete = previews[indexToDelete];
    const updatedPreviews = previews.filter((_, i) => i !== indexToDelete);

    const wasInitialImage = initialFiles.includes(previewToDelete);
    if (wasInitialImage && onInitialImageDelete) {
      onInitialImageDelete(); // Notify parent that initial image was deleted
    }
    // addedFiles 배열에서 해당 미리보기를 가진 File 객체 제거
    const updatedAddedFiles = addedFiles.filter(
      (file) => file.preview !== previewToDelete
    );

    setPreviews(updatedPreviews);
    setAddedFiles(updatedAddedFiles);
    onFilesChange(updatedAddedFiles); // 변경된 addedFiles 목록 전달

    if (selectedPreview === previewToDelete) {
      setSelectedPreview(updatedPreviews[0] || null);
    }
  };

  return (
    <section>
      <h3 className={$.sectionTitle}>이미지 선택</h3>
      <div {...getRootProps()} className={$.dropZone}>
        <input {...getInputProps()} />
        {selectedPreview ? (
          <img
            src={selectedPreview}
            className={$.selectedImage}
            alt="Selected"
          />
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
        {previews.map((previewUrl, index) => (
          <div
            key={index}
            className={`${$.imageWrap} ${
              selectedPreview === previewUrl ? $.selectedBorder : ""
            }`}
            onClick={() => setSelectedPreview(previewUrl)}
          >
            <button
              type="button"
              onClick={(e) => deleteImage(e, index)}
              className={$.deleteBtn}
            >
              <AiOutlineCloseCircle />
            </button>
            <img
              src={previewUrl}
              alt={`Preview ${index}`}
              className={$.imagePreview}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageUploader;
