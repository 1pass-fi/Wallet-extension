import Joi from 'joi'

export default Joi.object({
  picture: Joi.string().required().messages({
    'string.base': `"picture" should be a valid id of an image hosted on arweave`,
    'string.empty': 'A valid Image trxId is required',
  }),
  banner: Joi.string().required().messages({
    'string.base': `"banner" should be a valid id of an image hosted on arweave`,
    'string.empty': 'A valid Image trxId is required',
  }),
  description:Joi.string().required().messages({
    'string.empty': 'description is required',
  }),
  name:Joi.string().required().messages({
    'string.empty': 'valid name is required',
  }),
  links: Joi.array().items(
    Joi.object({
      title: Joi.string().required().messages({
        'string.base': `"title " should be a type of 'string'`,
        'string.empty': 'title cannot be empty',
      }),
      link: Joi.string().required().messages({
        'string.base': `"link" should be a type of 'string'`,
        'string.empty': 'url cannot be empty',
      }),
    })
  ),
  addresses:Joi.object(),
  styles:Joi.object(),
  code:Joi.string().empty(''),
  country:Joi.string().required().messages({
    'string.empty': 'country is required',
  }),
  pronouns:Joi.string().empty(''),
  kID:Joi.string().required().messages({
    'string.empty': 'kID is required',
  })
})
