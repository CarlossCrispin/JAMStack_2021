//Colecciones => tablas
//Documentos => Filas
const mongoose = require('mongoose');
const CourseSchema = mongoose.Schema(
  {
    /* content: {}, */
    title: String,
    views: Number,
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
  /* {
    timestamps: true,
  } */
);


module.exports = mongoose.model('Course', CourseSchema);
