const express = require('express');

const { buildSchema } = require('graphql');

const {graphqlHTTP} = require('express-graphql'); 

let courses = require('./courses');

const app = express();

const schema = buildSchema(` 
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
`);



const root = {
  getCourses({page, limit}) {
    if (page !== undefined) {
      return courses.slice(page * limit, (page + 1) * limit);
    }
    return courses;
  },
  getCourse({ id }) {
    console.log(id);
    return courses.find((course) => id == course.id);
  },
  addCourse({ input }) {
    const id = String(courses.length + 1);
    const course = { id, ...input };
    courses.push(course);
    return course;
  },
  updateCourse({ id, input }) {
    const courseindex = courses.findIndex((course) => id === course.id);
    const course = courses[courseindex];
    const newCourse = Object.assign(course, { ...input });
    course[courseindex] = newCourse;
    return newCourse;
  },
  deleteCourse({id}){
    courses = courses.filter((course) => course.id != id);
    return {
      message: `Curso con el id  : ${id} ha sido eliminado`
    }
  }
};

app.get('/', (req, res) => {
  res.send('Welcome');
});


//midleware
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

app.listen(8080, () => {
  console.log('====================================');
  console.log('Server listening 🔥');
  console.log('====================================');
});
