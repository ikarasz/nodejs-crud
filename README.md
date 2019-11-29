# Simple express app with Sequelize

## notes

### ES6 modules

Tha application can run on Node 13 with ES6 modules however since some of the
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

#### Eslint

Since there is no `__filename` variable in the ES6 modules environment I had to
define it with import.meta which broke eslint.
Solution: using `babel-eslint` parser.

### Architecture

I tried to separate the application in 3 main layers.

**Controllers** are responsible for the HTTP communication and all the REST
related settings, they are the entry points of the application. The should
contain no business logic. Their tasks are

- transform the entities shape between the public and the services
- managing status codes and responses and requests

**Services** are responsible for the business logic. They can be invoked by the
controllers or later on maybe by other input handlers. This is why i put the
data validation into the services. Based on the clean architecture they must
define the shape of entities and errors what can occur in the application.

**Storage** is an abstraction over the persistance layer it connect the services
and the underlying storage system. They should not contain any business logic.

#### Decisions which might have not been the best

- Since I am using ORM and the models provided by it I think the storage layer
  could be removed also the service layer redesign. Now I suppose that a simple
  MVC approach could be better with ORM. The reason behind this decision was
  that I wanted to make independent the service layer from Sequelize.

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

But still I learned a detailed client errors client errors about Sequelize what
I really enjoyed.

### Business decisions

Since the data structures are quite simple and I didn't get any detailed
specification I just skipped the format validation. However in a real
application it would be mandatory.
If I would validate the resource fields and I would use the `express-validator`
middleware which is quite easy to use and install.

- I handle all dates as UTC since that is pretty standard and can solve many
  common problems abut date management.
- I decided to not to use foreign key on the tasks table because that would make
  testing much dirtier however It really hurts me. I miss that constraint.
- I set the username unique since it is unique in most applications
- I don't let the API to update the username even if we have an id as well.
- I created a separated router for each module, so they can be reused in other
  applications.
- During resource update I handle all the fields mandatory since we use `PUT`
  request. I would update separate fields with `PATCH` requests.

### Tests

I've written unit test only for the service layer since that is the most
important part in the application however all the other layers should covered as
well.

I've written e2e tests for all the scenarios but I had to use mocks for testing
the failed db connection. I shouldn't mock anything there but I could trigger
connection error otherwise.

### Questions

Questions came up in me during development:

- can a task have earlier date?
- is date mandatory or can we use current date by default?
- i filter only users, but tasks should be as well, aren't thy?
- do we need the foreign key on the task, or can we create
  unassigned tasks?

### Missing must haves

- I've just reinstalled my computer and I have problems with `docker-compose`
  however I definitely wanted to add containers to the application.
- 400 responses must be more detailed, which field is missing, what the problem
  with the format. I decided to skip this part based on the simplicity of the
  resources the lack of my time.
