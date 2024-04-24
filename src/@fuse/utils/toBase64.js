export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const res = reader.result.replace(/^data:.+;base64,/, "");
      resolve(res);
    };
    reader.onerror = (error) => reject(error);
  });
