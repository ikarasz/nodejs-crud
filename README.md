# nodejs-crud

## notes

node could be upgraded so the experimental-modules flag can be removed but
mocha and eslint doesn't support this yet, so i decided to stick at node 12

heartbeat failure has no integration test, tried to setup the environment but
of course i couldn't change the exported pgp() method, further investigation is
needed

controllers are not tested, i focus on services because of the tiny timeframe

babel eslint is needed because if meta.import

sequelize the first i found and i'm not familiar with orm's in the node ecosystem
however because of migration and testing i decided to use one of them
I found some other options like
  - db-migrate
  - objection.js
  - js-data
