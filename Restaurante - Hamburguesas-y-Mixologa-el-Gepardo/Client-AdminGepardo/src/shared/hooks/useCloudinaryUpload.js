// src/shared/hooks/useCloudinaryUpload.js

const CLOUD_NAME = "dse9vxu8i";
const UPLOAD_PRESET = "Gepardo_preset";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Error al subir imagen a Cloudinary");
  }

  const data = await res.json();
  return data.secure_url;
};
