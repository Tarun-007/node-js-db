(async () => {
  const Joi = require("joi");
  class DB {
    constructor(dbName) {
      this.tables = {};
      this.dbName = dbName;
    }
    createTable(tableName, schema) {
      this.tables[tableName] = {
        data: [],
        schema,
      };
    }
  }

  class QueryExecutor {
    constructor(db) {
      this.db = db;
    }

    insert = async (tableName, obj) => {
      try {
        let table = this.db.tables[tableName];
        await table.schema.validate(obj);
        table.data.push(obj);
        console.log("insert successful!");
      } catch (error) {
        console.log(error);
        throw Error("invalid insert!");
      }
    };

    select = (tableName, queryObj) => {
      try {
        let { data: resultRows, schema } = this.db.tables[tableName];
        let { field, value } = queryObj;
        if (field && value) {
          return resultRows.filter((each) => {
            return each[field] == value;
          });
        }
        return resultRows;
      } catch (error) {
        console.log(error);
        throw Error("invalid select!");
      }
    };
  }

  class SelectQuery {
    constructor(tableName, field, value) {
      this.tableName = tableName;
      this.field = field;
      this.value = value;
    }
  }

  let database = new DB("test");
  let studentSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    register_no: Joi.number().integer().min(100000).max(99999).required(),

    birth_year: Joi.number().integer().min(1900).max(2013),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
  });

  database.createTable("students", studentSchema);
  let model = new QueryExecutor(database);

  let student = {
    name: "tarun",
    register_no: 100345,
    email: "tarunj12@gmail.com",
  };
  let query = new SelectQuery("students", "name", "tarun");
  await model.insert("students", student);
  console.log(database.tables);
  let students = model.select("students", query);
  console.log(students);
})();
