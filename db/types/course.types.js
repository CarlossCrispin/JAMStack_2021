module.exports = `
  type Course {
    id: ID
    title: String
    views: Int,
    user: User
  }
  type Alert {
    message: String
  }

  input CourseInput {
    title: String!
    views: Int
  }

  extend type Query {
    getCourses(page: Int, limit: Int): [Course]
    getCourse(id: ID!): Course
  }

  type Mutation {
    addCourse(input: CourseInput, user: ID!): Course
    updateCourse(id: ID!, input: CourseInput): Course
    deleteCourse(id: ID!): Alert
  }
`;