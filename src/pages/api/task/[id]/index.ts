import { NextApiRequest, NextApiResponse } from 'next'
import ITask from '../../../../dto/ITask'
import Task from '../../../../../tasks.json'
import fs from "fs"

export default function handler(req: NextApiRequest, res: NextApiResponse<ITask[] | ITask>) {
  console.log(req.method)

  if(req.method === 'GET')  {
    const query = req.query
    const { id } = query
    const task = Task.find( task => task.id === Number(id))
    return res.status(200).json(task)
  }

  if(req.method === 'DELETE') {
    const query = req.query
    const { id } = query
    const newTaskList = Task.filter(task => task.id !== Number(id))
    fs.writeFileSync('tasks.json', JSON.stringify(newTaskList))
    return res.status(200).json(newTaskList)
  }
}