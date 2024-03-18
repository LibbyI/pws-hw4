import {body, param, query} from 'express-validator'
import { isValidObjectId } from 'mongoose'

export const updateEventDateValidator = [
    param('eventId', 'invalid id').custom((value) => { console.log(value); return isValidObjectId(value)}),
    body('start_date', 'invalid start_date').exists().isDate(),
    body('end_date','invalid end_date').exists().isDate(),
    body('start_date', 'start_date cannot be later than end_date').custom((value, {req}) => { return value <= req.body.end_date}),
]