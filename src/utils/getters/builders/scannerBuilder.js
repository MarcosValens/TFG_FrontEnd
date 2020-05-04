function checkPort(port) {
  if (port > 65500) {
    throw { message: "Port number must not exceed 65500" };
  }
  if (port <= 0) {
    throw { message: "Port number should not be below or equal to 0" };
  }
  return true;
}

function isValidInput(input) {
  return (
    (input.includes("-") && !input.includes(",")) ||
    (!input.includes("-") && input.includes(",")) ||
    !!input.split("").join()
  );
}

function parseRange([min, max]) {
  min = parseInt(min);
  max = parseInt(max);
  if (max < min) {
    const temp = min;
    min = max;
    max = temp;
  }
  checkPort(min);
  checkPort(max);
  try {
    const ports = Array.apply(null, Array(max - min)).map(
      (useless, increment) => {
        useless = min + increment;
        return useless;
      }
    );

    ports.push(max);
    return ports;
  } catch (e) {
    throw { message: "Please check your input" };
  }
}

function parsePorts(input) {
  if (!isValidInput(input)) return { error: "Please enter a valid input" };
  if (!input.includes(",") && !input.includes("-"))
    return checkPort(parseInt(input)) ? [input] : null;
  const delimiter = input.includes(",") ? "," : "-";

  return delimiter === ","
    ? input.split(delimiter).map(port => {
        checkPort(port);
        return port;
      })
    : parseRange(input.split(delimiter));
}
function checkAndGet(ports) {
  if (!ports.match(/^[\d\,\-]+$/)) throw { message: "Please check your input" };
  const parsedPorts = parsePorts(ports);
  if (parsedPorts.error) {
    throw { message: parsedPorts.error };
  }
  return parsedPorts;
}

export default {
  ping: {
    host(ip) {
      return { ip };
    }
  },
  port(host, ports) {
    const data = {
      ip: host
    };
    if (!ports) return data;
    const parsedPorts = checkAndGet(ports);
    data.ports = parsedPorts;
    return data;
  },
  checkInputAndGetPorts(ports) {
    if (!ports) return true;
    return checkAndGet(ports);
  }
};
