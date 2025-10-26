import { useDropzone } from "react-dropzone";
import React, { useState, useEffect } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineSearch,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import $ from "./../../pages/PlacesPage/PostPlacePage2.module.css";

const ImageUploader = ({ onFilesChange, initialFiles = [] }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(null);

  useEffect(() => {
    // 초기 URL을 previews 상태에 설정
    setPreviews(initialFiles);
    // 첫 번째 초기 이미지를 기본 선택 이미지로 설정
    if (initialFiles.length > 0) {
      setSelectedPreview(initialFiles[0]);
    }
    // 초기 File 객체는 비어있음
    setFiles([]);
  }, [initialFiles]); // initialFiles가 변경될 때만 실행

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      const updatedPreviews = [
        ...previews,
        ...newFileObjects.map((f) => f.preview),
      ].slice(0, 5);
      const updatedFiles = [...files, ...newFileObjects].slice(0, 5); // File 객체도 업데이트

      setPreviews(updatedPreviews);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles); // File 객체만 부모로 전달
      if (!selectedPreview) setSelectedPreview(newFileObjects[0]?.preview);
    },
  });

  const deleteImage = (e, indexToDelete) => {
    e.stopPropagation();
    const previewToDelete = previews[indexToDelete];
    const updatedPreviews = previews.filter((_, i) => i !== indexToDelete);

    // File 객체 배열에서도 해당 preview URL을 가진 파일 제거
    const updatedFiles = files.filter(
      (file) => file.preview !== previewToDelete
    );

    setPreviews(updatedPreviews);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles); // 변경된 File 객체 목록 전달

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
