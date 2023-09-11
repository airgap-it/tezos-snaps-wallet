export const isMobile = () => {
  if (/Android|iPhone/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
};
