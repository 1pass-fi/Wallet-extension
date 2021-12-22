import Joi from 'joi'

export default Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  owner: Joi.string().required(),
  collection: Joi.array().items(Joi.string())
})
