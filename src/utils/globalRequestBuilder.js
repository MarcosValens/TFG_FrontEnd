import getters from './getters';

export default function build(name, method, data) {
  console.log(name, method, data)
  const endpoint = getters[name][method]();

  if (!data) return {endpoint};

  const dataFromBuilder = getters[name].builder[method].call(this, data);
  return {endpoint, dataFromBuilder};
}
