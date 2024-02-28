export const handleVideoUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tags", "codeinfuse, medium, gist");
      formData.append("upload_preset", "edupluss"); // Reemplaza con tu upload preset de Cloudinary
      formData.append("api_key", "177349447724448");
  
      const response = await fetch("https://api.cloudinary.com/v1_1/dlzrjejko/video/upload", {
        method: "POST",
        body: formData,
        headers: { "X-Requested-With": "XMLHttpRequest"}
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const responseData = await response.json();
      return responseData.secure_url;
      
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  };
  