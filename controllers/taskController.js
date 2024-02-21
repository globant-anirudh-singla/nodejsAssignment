const apiError = require('../error/apiError');
const customError = require('../error/customError');
const taskService = require('../services/taskService');
const { taskIdSchema, taskUpdateSchema, taskSchema } = require('../validations/taskValidation');

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks();
    if (!tasks) {
      throw new customError(404, 'Task not found');
    }
    return res.status(200).send({ tasks });
  } catch (err) {
    if(err instanceof customError) {
      return next(err);
    }
    return next();
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { error } = taskIdSchema.validate(req.params);
    if (error) throw new apiError(error.details[0].message);
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    if (!task) {
      throw new customError(404, 'Task not found');
    }
    return res.status(200).send({ task });
  } catch (err) {
    if(err instanceof customError || err instanceof apiError) {
      return next(err);
    }
    return next();
  }
};

const createTask = async (req, res, next) => {
  try {
    console.log(new Date(new Date()/1000));
    const { error } = taskSchema.validate(req.body);
    if (error) throw new apiError(error.details[0].message);
    const { title, completed = false } = req.body;
    const task = await taskService.createTask(title, completed);
    if (!task) {
      throw new customError(409, 'Failed to create task');
    }
    return res.status(200).send({ task });
  } catch (err) {
    if(err instanceof customError || err instanceof apiError) {
      return next(err);
    }
    return next();
  }
};

const updateTask = async (req, res, next) => {
  try {
    const taskIdValidation = taskIdSchema.validate(req.params);
    const taskUpdateValidation = taskUpdateSchema.validate(req.body);

    if (taskIdValidation.error) throw new apiError(taskIdValidation.error.details[0].message);
    if (taskUpdateValidation.error) throw new apiError(taskUpdateValidation.error.details[0].message);

    const { id } = req.params;
    const { title, completed } = req.body;
    const task = await taskService.updateTask(id, title, completed);
    if (task) {
      throw new customError(404, 'Task not found');
    }
    return res.status(200).send({ task });
  } catch (err) {
    if(err instanceof customError || err instanceof apiError) {
      return next(err);
    }
    return next();
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { error } = taskIdSchema.validate(req.params);
    if (error) throw new apiError(error.details[0].message);
    const { id } = req.params;
    const result = await taskService.deleteTask(id);
    if (result.changes === 0) {
      throw new customError(404, 'Task not found');
    }
    return res.status(200).send({ message: 'task deleted' });
  } catch (err) {
    if(err instanceof customError || err instanceof apiError) {
      return next(err);
    }
    return next();
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
