export default (...args) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log.apply(null, args);
  }
};
