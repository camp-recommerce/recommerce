export const formatDateTime = (isoString) => {
  return isoString.replace("T", " ");
};

export const getInitialDateTime = () => {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
