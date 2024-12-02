export const generateFakeData = () => ({
  title: "Mill A-101",
  millState: "Operating",
  shift1: Math.floor(Math.random() * 100),
  shift2: Math.floor(Math.random() * 100),
  shift3: Math.floor(Math.random() * 100),
  load: Math.floor(Math.random() * 100),
  loadArray: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
});
