export const loadAppConfig = () => {
  if (
    !process.env.REACT_APP_VERSION ||
    !process.env.REACT_APP_CLIENT_ID ||
    !process.env.REACT_APP_USE_AUTH ||
    !process.env.REACT_APP_LANGUAGE ||
    !process.env.REACT_APP_SECRET
  ) {
    throw Error('Missing Env');
  }

  const {
    REACT_APP_VERSION,
    REACT_APP_CLIENT_ID,
    REACT_APP_USE_AUTH,
    REACT_APP_LANGUAGE,
    REACT_APP_SECRET,
  } = process.env;

  return {
    REACT_APP_VERSION,
    REACT_APP_CLIENT_ID,
    REACT_APP_USE_AUTH: REACT_APP_USE_AUTH === 'true',
    REACT_APP_LANGUAGE,
    REACT_APP_SECRET,
  };
};
