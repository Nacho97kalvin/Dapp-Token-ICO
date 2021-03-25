module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  contracts_build_directory: './src/artifacts',
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    }
    //  test: {
    //    host: "127.0.0.1",
    //    port: 7545,
    //    network_id: "*"
    //  }
    //}
    //
  },
  compliers: {
    solc: {
      version: "0.7.4",
      parser: "solcjs"
    }
  }
}