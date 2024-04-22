export const formatDateTime = (isoString) => {
  return isoString.replace("T", " ");
};

export const getInitialStartTime = () => {
  const now = new Date();
  now.setDate(now.getDate() + 7);
  now.setHours(12, 0, 0, 0);
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

export const getInitialClosingTime = () => {
  const now = new Date();
  now.setDate(now.getDate() + 14);
  now.setHours(18, 0, 0, 0);
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
