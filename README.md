# cabot-zombie

Automate your configuration of Cabot monitoring.

[Cabot](http://cabotapp.com/) is a self-hosted monitoring and alert service. But unfortunately it lacks an HTTP API to automate configuration.

cabot-zombie runs a headless browser (Zombie.js) that creates your configuration based on a simple Javascript object.

Cabot let's you create multiple services, instances and checks. cabot-zombie currently supports a configuration that creates N services, each one running on N instances, and with N checks (only HTTP checks supported right now).

## Install

```
npm i -S cabot-zombie
```

## Configure

createServices.js
```
const cabotZombie = require('cabot-zombie')
const config = require('./config')

cabotZombie(config)
  .then(() => console.log('All done!'))
```

config.js
```
module.exports = {
  baseUrl: 'http://my-host-with-cabot:1234/',
  credentials: {
    username: 'docker', // cabot's default username when installed with docker
    password: 'docker', // cabot's default password when installed with docker
  },
  data: {
    services: [
      {
        name: 'service-a',
        instances: [
          {
            address: 'my-host-a', // will automatically create a default ping check to this host
            checks: [
              {
                type: 'http',
                endpoint: 'http://my-host-a/my-page',
                textMatch: 'my page should contain this',
                frequency: 1, # minute - default is 5 minutes
              },
            ],
          },
          {
            address: 'my-host-b',
            checks: [
              {
                type: 'http',
                endpoint: 'http://my-host-b/my-page',
                textMatch: 'my page should contain this',
              },
            ],
          },
        ],
      },
    ],
  },
}
```

## Options

Second parameter to `cabotZombie` call is an object that can override some functions used in the process.

```
cabotZombie(config, {
  // customize service name. `data` contains data about the current service
  resolveServiceName: (data) => { ... },

  // customize service name. `data` contains data about the current service and instance
  resolveInstanceName: (data) => { ... },

  // customize service name. `data` contains data about the current service, instance and check
  resolveCheckName: (data) => { ... },

  // customize matching the check names to be added to a service. This is used when Zombie.js has to select the checks that are part of a service.
  customCheckNameMatcher: (checkName, data) => { ... },
})
```

## Contributing

cabot-zombie fits perfectly the configuration that I want to do, but it isn't very generic.

Any pull requests in that sense would be greatly appreciated.

## License

MIT
