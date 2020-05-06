# Simple express demo app with Sequelize

## notes

### ES6 modules

Tha application can run on Node 13< with ES6 modules however since some of the
used libraries can't run with pure ES6 modules the tests must run in Node 12.

#### Sequelize

- I had to use the sequelize-cli-esm package to generate the scripts.
- The generated scripts uses the `sequelize.import` which fails with ES6 modules
  so I had to replace it with:
  ```js
  const { default: modelCreator } = await import(path.join(__dirname, file));
  const model = modelCreator(sequelize, Sequelize);
  ```
  This is why I had to call the associate methods asynchronously.

#### ESLint

Since there is no `__filename` variable in the ES6 modules environment I had to
define it with import.meta which broke ESLint.
Solution: using `babel-eslint` parser.

### Architecture

I tried to separate the application in 3 main layers.

**Controllers** are responsible for the HTTP communication and all the REST
related settings, they are the entry points of the application. They should
contain no business logic. Their tasks are

- transform the entities shape between the public and the services
- managing status codes, responses and requests

**Services** are responsible for the business logic. They can be invoked by the
controllers or later on maybe by other input handlers. This is why I put the
data validation into the services. Based on the clean architecture they must
define the shape of entities and errors what can occur in the application.

**Storage** is an abstraction over the persistance layer it connects the
services and the underlying storage system. They should not contain any business
logic.

#### Decisions which might have not been the best

- Since I am using ORM and the models provided by it, I think the storage layer
  could be removed also the service layer redesigned. Now I suppose that a
  simple MVC approach could be better with ORM. The reason behind this decision
  was that I wanted to make the service layer independent from Sequelize.

- I import the user storage into the tasks storage which couples them together
  this gave me a strong headache, now these components cannot be used
  independently, I still didn't find a better idea w/o duplication.

#### ORM

This is the first time when I work wit an ORM in a JS application. I wanted to
try it out and wanted to make the migration easier. Now I might go with a
simple DAO layer where I write my own SQL scripts combined with a simple
migration library like `db-migrate`.

I picked Sequelize because it was the first I found but after a short googling
I found `objection.js` or `js-data`, they might have been a better choice, I
should investigate them.

Still I learned a lot while working with Sequelize so it is fun for a practice
project like this.

### Business decisions

Since the data structures are quite simple I just skipped the format validation.
In a production ready application it would be mandatory.
If I would validate the resource fields, I would use the `express-validator`
middleware which is quite easy to use and install.

- I handle all dates as UTC since that is pretty standard and can solve many
  common problems about date management.
- I decided to not to use foreign key on the tasks table because that would make
  testing much dirtier however it really hurts me. I miss that constraint.
- I set the username unique since it is unique in most applications.
- I don't let the API to update the username even if we have an id as well.
- I created separated routers for each module, so they can be reused in other
  applications.
- During resource update I handle all the fields mandatory since we use `PUT`
  request. I would update separate fields with `PATCH` requests.

### Tests

I've written unit test only for the service layer since that is the most
important part in the application however all the other layers should be covered
as well.

I've written e2e tests for all the scenarios but I had to use mocks for testing
the failed db connection. I shouldn't mock anything there but I couldn't trigger
connection error otherwise.

### Open Questions

Questions came up during development:

- Can a task have earlier date?
- Is date mandatory or can we use current date by default?
- I filter only users, but tasks should be as well, aren't they?
- Do we need the foreign key on the task, or can we create
  unassigned tasks?

### Future ideas

- 400 responses must be more detailed, which field is missing, what the problem
  with the format. I decided to skip this part based on the simplicity of the
  resources.
- Add some CI to check the styleguide and validate tests
