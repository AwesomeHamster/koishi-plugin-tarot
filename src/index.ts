import { Context, h, Schema } from 'koishi'

export const name = 'tarot'
export const Config = Schema.object({})

export function apply(ctx: Context) {
  ctx
    .command('tarot')
    .alias('塔罗')
    .alias('塔罗牌')
    .option('minimal', '-m')
    .action(async ({ options }) => {
      let result = await getTarot(ctx)
      let img = result.match(/(?<=(±img=)).+(?=±)/g)[0]

      if (options.minimal) {
        return h('img', { src: img })
      }

      let text1 = result.match(/.+(?=(±i))/g)[0].replace(/(\\r)/, '\n')
      let text2 = result.match(/(?<=(g±)).+/g)[0].replace(/(\\r)/, ' ')
      return h('message', h('img', { src: img }), text1, text2)
    })

  ctx.i18n.define('zh-CN', {
    'commands.tarot': {
      description: '抽取一张塔罗牌',
      options: {
        minimal: '仅输出图片',
      },
    },
  })
  ctx.i18n.define('en-US', {
    'commands.tarot': {
      description: 'Draw a tarot card (Chinese only)',
      options: {
        minimal: 'show image only',
      },
    },
  })
}

async function getTarot(ctx) {
  let result = await ctx.http.get('http://api.tangdouz.com/tarot.php')
  return result
}
