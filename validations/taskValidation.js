// validations/taskValidation.js

const Joi = require('joi');

const taskIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const taskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  completed: Joi.boolean().required(),
});

const taskUpdateSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  completed: Joi.boolean().required(),
}).min(1);

module.exports = {
  taskIdSchema,
  taskSchema,
  taskUpdateSchema
};
