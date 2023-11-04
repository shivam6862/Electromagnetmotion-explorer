const usePYModels = () => {
  const generateImage = async (dataset) => {
    try {
      const response = await fetch(`http://localhost:8501/generateimage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataset: dataset,
        }),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      const data = [
        {
          predictions_dataset: [],
          image_url: "/bg-amazing.webp",
          message: "Predictions failed to work.",
        },
      ];
      return data;
    }
  };
  return { generateImage };
};
export default usePYModels;
