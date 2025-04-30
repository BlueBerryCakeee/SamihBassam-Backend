const axios = require("axios");
const FormData = require("form-data");
const stream = require("stream");

exports.uploadImage = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);

  formData.append("file", bufferStream, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  try {
    const response = await axios.post(
      `${process.env.BASE_URL_ZIPLINE}/api/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_ZIPLINE}`,
          ...formData.getHeaders(),
        },
      }
    );

    return response.data.url;
  } catch (error) {
    console.error("Upload to Zipline failed:", error.response?.data || error.message);
    return null;
  }
};
