import Joi from 'joi'

export default Joi.object({
  isNSFW: Joi.boolean().required(),
  ownerName: Joi.string().required(),
  ownerAddress: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  contentType: Joi.string().required(),
  createdAt: Joi.number().required()
})
