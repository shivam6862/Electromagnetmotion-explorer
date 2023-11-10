import Toast from '@remobile/react-native-toast';
const usePYModels = () => {
  const generateImage = async dataset => {
    if (dataset.length == 0) {
      dataset = [
        {
          angle: 4.85,
          timeInMillisec: 10,
        },
      ];
    }
    try {
      const response = await fetch(`http://localhost:8501/generateimage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataset: dataset,
        }),
      });
      const data = await response.json();
      if (data.status == data.status) {
        Toast.showShortBottom(data.title);
      }
      return data.image_url;
    } catch (error) {
      console.log(error.message);
      const data = ['/bg-amazing.webp'];
      return data;
    }
  };
  return {generateImage};
};
export default usePYModels;
