import Joi from 'joi'

export default Joi.object({
  name: Joi.string().required(), // inputted username
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  title: Joi.string().required(),
  collection: Joi.array().items(Joi.string()),
  previewImageIndex: Joi.number().required(),
  owner: Joi.string().required()
})
