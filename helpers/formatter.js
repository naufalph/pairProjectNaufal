function dateDescription (date) {
  const now = new Date().getTime();
  const difference = now - date.getTime();
  if(difference>=864000000){
    return `${Math.round(difference / 864000000)} day(s) ago`;
  }
  if (difference >= 3600000) {
    return `${Math.round(difference / 3600000)} hour(s) ago`;
  } else {
    return `${Math.round(difference / 60000)} minute(s) ago`;
  }
}

module.exports = {
  dateDescription
}