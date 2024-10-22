const typeDefs = `
  # TODO: Add a comment describing the functionality of this statement
  # the schema defines the Class type which has the fields _id, name, building, and creditHours and the Query type which has a classes field that returns an array of Class objects.
  type Class {
    _id: ID
    name: String
    building: String
    creditHours: Int
  }

  # TODO: Add a comment describing the functionality of this statement
  # the Query type defines the classes field which returns an array of Class objects.
  type Query {
    classes: [Class]
  }
`;

module.exports = typeDefs;
