const getParams = value => {
  const param = new URL(location.href).searchParams.get(value);

  return param;
};

export default getParams;
