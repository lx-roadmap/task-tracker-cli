// 命令行参数
// 注：数组 process.argv 的前两项分别为 node.exe 或 当前js文件 的绝对路径
let args = process.argv.slice(2)

// 文件相关
let fs = require('fs')
let DATAPATH = './data.json'
if (!fs.existsSync(DATAPATH)) {
  fs.writeFileSync(DATAPATH, '[]')
}

let err = (msg) => {
  msg = msg || 'error'
  console.log(`\x1B[31merror: ${msg}\x1B[37m`)
  // console.log(`\x1B[31m\x1B[41merror: ${msg}\x1B[37m\x1B[40m`)
  process.exit()
}


fs.readFile(DATAPATH, 'utf8', (err_, data) => {
  data = JSON.parse(data)

  let funcs = {
    save: () => fs.writeFileSync(DATAPATH, JSON.stringify(data)),
    query: (x) => data
      .map((v, i) => ({...v, _idx: i}))
      .filter(v => {
      for (let k in x) {
        if (x[k] && x[k] !== v[k]) {
          return false
        }
      }
      return true
    })
  }

  let cmd_handler = {
    add: () => {
      if (!args[1]) {
        err('缺少参数 description')
      }
      let desc = args[1]
      let stamp = new Date().getTime()
      data.push({
        id: stamp,
        description: desc,
        status: 'todo',
        createdAt: stamp,
        updateAt: stamp
      })
      funcs.save()
    },
    update: () => {
      if (!args[1] || !args[2]) {
        err('缺少参数 id 或 description')
      }
      let id = parseInt(args[1]), desc = args[2]

      for (let v of funcs.query({ id })) {
        data[v._idx].description = desc
        data[v._idx].updateAt = new Date().getTime()
      }
      funcs.save()
    },
    delete: () => {
      if (!args[1]) {
        err('缺少参数 id')
      }
      let id = parseInt(args[1])

      for (let v of funcs.query({ id })) {
        data = data.filter((w, i) => v._idx !== i)
      }
      funcs.save()
    },
    'mark-in-progress': () => {
      if (!args[1]) {
        err('缺少参数 id')
      }
      let id = parseInt(args[1])

      for (let v of funcs.query({ id })) {
        data[v._idx].status = 'in-progress'
        data[v._idx].updateAt = new Date().getTime()
      }
      funcs.save()
    },
    'mark-done': () => {
      if (!args[1]) {
        err('缺少参数 id')
      }
      let id = parseInt(args[1])
      
      for (let v of funcs.query({ id })) {
        data[v._idx].status = 'done'
        data[v._idx].updateAt = new Date().getTime()
      }
      funcs.save()
    },
    list: () => {
      let st = args[1]
      let format_date = (date) => {
        date = new Date(date)
        return `${date.getFullYear()}/${date.getMonth()+1}/${date.getUTCDate()} ${date.getHours()}:${date.getMinutes()}`
      }
      let print = (arr) => {
        console.log('id\t\tdescription\tstatus\tcreatedAt\tupdateAt')
        arr.forEach(v => {
          let color = v.status === 'todo' ? '\x1b[31m' : (v.status === 'in-progress' ? '\x1b[33m' : '\x1b[32m')
          console.log(`${v.id}\t${color}${v.description}\x1b[37m\t${v.status}\t${format_date(v.createdAt)}\t${format_date(v.updateAt)}`)
        })
      }
      if (!st) {
        print(data)
      } else if(['todo', 'in-progress', 'done'].find(v => v===st)){
        print(funcs.query({status: st}))
      } else {
        err(`无效参数: ${st}`)
      }
    }
  }
  // 别名
  cmd_handler.del = cmd_handler.delete
  cmd_handler.up = cmd_handler.update
  cmd_handler.ls = cmd_handler.list


  // 
  let cmd = args[0]
  if (!cmd) {
    err('至少要有一个参数')
  }
  if (!cmd_handler[cmd]) {
    err('没有此命令')
  }
  // 执行命令
  cmd_handler[cmd]()
})

