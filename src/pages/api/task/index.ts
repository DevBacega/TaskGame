import { NextApiRequest, NextApiResponse } from 'next'
import ITask from '../../../dto/ITask'
import Task from '../../../../tasks.json'
import fs from "fs"

export default function handler(req: NextApiRequest, res: NextApiResponse<ITask[]>) {
  if(req.method === 'GET')  { 
    return res.status(200).json(Task as ITask[])
  }
  if(req.method === 'POST') {
    const { description } =  JSON.parse(req.body)
    Task.push({id: Task.length + 1, description: description, amount: 90, mark: false})
    fs.writeFileSync('tasks.json', JSON.stringify(Task))
    return res.status(200).json(Task as ITask[])
  }
}