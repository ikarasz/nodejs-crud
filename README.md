# nodejs-crud

## notes

node could be upgraded so the experimental-modules flag can be removed but
mocha and eslint doesn't support this yet, so i decided to stick at node 12

controllers are not tested, i focus on services because of the tiny timeframe

babel eslint is needed because if meta.import

sequelize the first i found and i'm not familiar with orm's in the node ecosystem
however because of migration and testing i decided to use one of them
I found some other options like
  - db-migrate
  - objection.js
  - js-data

sequalize.import must been replaced because it breaks with es6 modules

since there are no complex restrictions about the resource fields i will go with
simple validation, however in a complex situation i would consider the use of
express-validator

cause of the simplicity i didn't care about value transformation,
however based on the clean architecture i should transform the data
at the boundaries of the services

I cant stub the sequelize models so i cannot cover db errors in e2e
tests
