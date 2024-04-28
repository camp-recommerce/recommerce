export const formatNumber = (num) => {
  if (num == null) return "0"; // `null` 또는 `undefined`인 경우 "0" 반환

  if (num === 0) return "0";

  let regex = /(^[+-]?\d+)(\d{3})/;
  let nstr = num.toString();
  while (regex.test(nstr)) {
    nstr = nstr.replace(regex, "$1" + "," + "$2");
  }
  return nstr;
};
export const formatPrice = (num) => {
  if (num == null) return "0"; // 입력 값이 `null` 또는 `undefined`인 경우 "0" 반환

  // 천원 단위에서 반올림
  num = Math.round(num / 1000) * 1000;

  // 숫자를 문자열로 변환하고, 정규식을 사용하여 세 자리마다 콤마 찍기
  return num.toLocaleString();
};
