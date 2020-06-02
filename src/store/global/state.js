/*
[
      {
        _id: "5eac9f0093e0552c00a39a12",
        ipAddress: "192.168.1.65",
        description: "",
        ports: [],
        alive: true,
        __v: 0
      },
      {
        _id: "5eac9f0093e0552ecda39a10",
        ipAddress: "192.168.1.19",
        description: "",
        ports: [
          {
            _id: "5ead5d5dcbe7fb45035e82bd",
            open: true,
            service: "",
            port: 8080,
            __v: 0
          }
        ],
        alive: true,
        __v: 1
      },
      {
        _id: "5eac9f0093e0554fd9a39a13",
        ipAddress: "192.168.1.99",
        description: "",
        ports: [],
        alive: true,
        __v: 0
      },
      {
        _id: "5eac9f0093e0556d70a39a15",
        ipAddress: "192.168.1.104",
        description: "",
        ports: [],
        alive: true,
        __v: 0
      },
      {
        _id: "5eac9f0093e055dcf0a39a11",
        ipAddress: "192.168.1.54",
        description: "",
        ports: [
          {
            _id: "5ead5d55cbe7fbe0555e82b7",
            open: true,
            service: "",
            port: 8080,
            __v: 0
          }
        ],
        alive: true,
        __v: 1
      },
      {
        _id: "5ead5d40cbe7fb5a125e82b3",
        ipAddress: "192.168.1.1",
        description: "",
        ports: [],
        alive: true,
        __v: 0
      },
      {
        _id: "5ead5d53cbe7fb40025e82b4",
        ipAddress: "192.168.1.1",
        description: "",
        ports: [
          {
            _id: "5ead5d5dcbe7fb485f5e82b9",
            open: true,
            service: "",
            port: 80,
            __v: 0
          },
          {
            _id: "5ead5d5dcbe7fbd1385e82ba",
            open: true,
            service: "",
            port: 443,
            __v: 0
          }
        ],
        alive: true,
        __v: 1
      },
      {
        _id: "5ead5d53cbe7fb82aa5e82b6",
        ipAddress: "192.168.1.117",
        description: "",
        ports: [],
        alive: true,
        __v: 0
      },
      {
        _id: "5ead5d53cbe7fbacb05e82b5",
        ipAddress: "192.168.1.116",
        description: "",
        ports: [],
        alive: true,
        __v: 0
      }
    ]
    */

export default function() {
  return {
    networks: [],
    hosts: [],
    currentNetwork: {},
    currentHost: {},
    currentPort: "",
    darkMode: true,
    user: {},
    userImageUrl: "",
    autoDetect: JSON.parse(localStorage.getItem("auto-detect")) || false
  };
}
