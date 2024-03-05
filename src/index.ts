import { Context, h, Schema } from 'koishi'

export const name = 'tarot'
export const Config = Schema.object({})

export function apply(ctx: Context) {
  ctx
    .command('tarot')
    .alias('塔罗')
    .alias('塔罗牌')
    .action(async () => {
      let result = await getTarot(ctx)
      let img = result.match(/(?<=(±img=)).+(?=±)/g)[0]
      let text1 = result.match(/.+(?=(±i))/g)[0].replace(/(\\r)/, '\n')
      let text2 = result.match(/(?<=(g±)).+/g)[0].replace(/(\\r)/, ' ')
      return h('message', text1, h('image', { url: img }), text2)
    })

  ctx.i18n.define('zh-CN', {
    'commands.tarot': {
      description: '抽取一张塔罗牌',
    },
  })
  ctx.i18n.define('en-US', {
    'commands.tarot': {
      description: 'Draw a tarot card (Chinese only)',
    },
  })
}

async function getTarot(ctx) {
  let result = await ctx.http.get('http://api.tangdouz.com/tarot.php')
  return result
}
