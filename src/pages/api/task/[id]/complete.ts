import { NextApiRequest, NextApiResponse } from 'next'
import ITask from '../../../../dto/ITask'
import Task from '../../../../../tasks.json'
import fs from "fs"

export default function handler(req: NextApiRequest, res: NextApiResponse<ITask[]>) {
  
  const absolutePath = process.cwd()

  if(req.method === 'PUT')  {
    const query = req.query
    const { id } = query
    const newTaskList = Task.map( task => {
      if(task.id === Number(id)) {
        task.mark = true
      }
      return task
    })
    fs.writeFileSync(absolutePath + '/tasks.json', JSON.stringify(newTaskList))
    return res.status(200).json(newTaskList)
  }

}