const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

let courses = require('./courses');

const typeDefs = `
  type Course{
    id: ID,
    title: String,
    views: Int
  }
  type Alert {
    message: String
  }
  
  input CourseInput{
    title: String!,
    views: Int
  }

  type Query{
    getCourses(page: Int, limit: Int): [Course]
    getCourse(id:ID!): Course
  }

  type Mutation{
    addCourse(input: CourseInput): Course
    updateCourse(id: ID!, input: CourseInput  ): Course
    deleteCourse(id: ID!): Alert
  }
`;
const resolvers = {
  Query: {
    getCourses(obj, { page, limit }) {
      if (page !== undefined) {
        return courses.slice(page * limit, (page + 1) * limit);
      }
      return courses;
    },
    getCourse(obj, { id }) {
      console.log(id);
      return courses.find((course) => id == course.id);
    },
  },
  Mutation: {
    addCourse(obj, { input }) {
      const id = String(courses.length + 1);
      const course = { id, ...input };
      courses.push(course);
      return course;
    },
    updateCourse(obj, { id, input }) {
      const courseindex = courses.findIndex((course) => id === course.id);
      const course = courses[courseindex];
      const newCourse = Object.assign(course, { ...input });
      course[courseindex] = newCourse;
      return newCourse;
    },
    deleteCourse(obj, { id }) {
      courses = courses.filter((course) => course.id != id);
      return {
        message: `Curso con el id  : ${id} ha sido eliminado`,
      };
    },
  },
};
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
});

server.listen().then(({ url }) => {
  console.log(`Servidor iniciado en ${url}`);
});
