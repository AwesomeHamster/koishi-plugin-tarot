import { Context, h, Schema } from 'koishi'

export const name = 'tarot'
export const Config = Schema.object({})

export function apply(ctx: Context) {
  ctx
    .command('tarot')
    .alias('塔罗')
    .alias('塔罗牌')
    .option('count', '-n <count:posint>')
    .option('minimal', '-m')
    .action(async ({ options }) => {
      let ret: h = []

      for (let i = 0; i < options.count || 1; i++) {
        let result = await getTarot(ctx)
        let img = result.match(/(?<=(±img=)).+(?=±)/g)[0]

        if (options.minimal) {
          ret.push(h('img', { src: img }))
          continue
        }

        let text1 = result.match(/.+(?=(±i))/g)[0].replace(/(\\r)/, '\n')
        let text2 = result.match(/(?<=(g±)).+/g)[0].replace(/(\\r)/, ' ')
        ret.push(h('img', { src: img }), text1, text2)
      }
      
      return h('message', ret)
    })

  ctx.i18n.define('zh-CN', {
    'commands.tarot': {
      description: '抽取一张塔罗牌',
      options: {
        minimal: '仅输出图片',
        count: '抽取张数',
      },
    },
  })
  ctx.i18n.define('en-US', {
    'commands.tarot': {
      description: 'Draw a tarot card (Chinese only)',
      options: {
        minimal: 'show image only',
        count: 'number of cards',
      },
    },
  })
}

async function getTarot(ctx) {
  let result = await ctx.http.get('http://api.tangdouz.com/tarot.php')
  return result
}
