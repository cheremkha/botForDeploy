require('dotenv').config();
const {
    Bot,
    GrammyError,
    HttpError,
    Keyboard,
    InlineKeyboard,
} = require('grammy');

const {hydrate} = require('@grammyjs/hydrate');

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
    {
        command: 'start', 
        description: "Start bot for talking with you"
    },
    {
        command: 'menu',
        description: 'Open general menu'
    },
    {
        command: 'help',
        description: 'help you'
    },
    {
        command: 'mood',
        description: 'Ask you some question'
    },
    {
        command: 'keyboard',
        description: 'Paste reaction on your msg'
    },
    {
        command: 'share',
        description: 'Sharing your inform'
    }, 
    {
        command: 'inline_keyboard',
        description: 'Touch and known co robit'
    }
])

const menuKeyboard = new InlineKeyboard()
    .text("Known status your delivery", 'order-status')
    .text('helping operator', 'support');

const backKeyboard = new InlineKeyboard().text("< Back", "back");

bot.command('menu', async (ctx) => {
    await ctx.react('☃')
    await ctx.reply('Choise onece on menu: ', {
        reply_markup: menuKeyboard,
    })
})

bot.callbackQuery('order-status', async (ctx) => {
    await ctx.callbackQuery.message.editText('Status : by car pizdue v chornogoriu',{
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
})

bot.callbackQuery('support', async (ctx) => {
    await ctx.callbackQuery.message.editText('Input your problem: ',{
        reply_markup: backKeyboard,
    });
        await ctx.answerCallbackQuery();
})

bot.callbackQuery('back', async (ctx) => {
    await ctx.callbackQuery.message.editText('Choise onece on menu: ',{
        reply_markup: menuKeyboard,
    });
        await ctx.answerCallbackQuery();
})



bot.command('start', async (ctx) => {
    await ctx.reply("Hello I'm bot")
})

bot.command('keyboard', async (ctx) => {
    const moodLabels = ['Cold', 'Hot', 'Warm'];
    const rows = moodLabels.map( (label) => {
        return [
            Keyboard.text(label)
        ]
    })
    const Keyboard2 = Keyboard.from(rows).resized()
    await ctx.react('👀')
    await ctx.reply('What`s wather today?', {
        reply_markup: Keyboard2,
    })
})

bot.command('mood', async(ctx) => {
    const moodKeyboard = new Keyboard()
    .text('Good')
    .row()
    .text("Not Bad")
    .row()
    .text("fuck you, niga")
    .resized()
    await ctx.reply("What are you mood?", {
        reply_markup: moodKeyboard,
    })
})

bot.hears('fuck you, niga', async (ctx) => {
    await ctx.reply('Sperdaliav na Ukrainu', {
        reply_markup: {remove_keyboard: true} 
    })
})

bot.on('message:photo', async(ctx) => {
    await ctx.reply('Thanks for you photo')
})


bot.command('help', async (ctx) => {
    await ctx.react('🌚');
    await ctx.reply('What *you* _need_? [link:](https://github.com/cheremkha)' , {
        parse_mode: 'MarkdownV2',
    })
}) 



bot.command('share', async (ctx) => {
    const shareKeyboard = new Keyboard()
    .requestLocation("Geologation")
    .requestContact('Phone')
    .requestPoll('Poll')
    .resized()
    .placeholder("Co ty kurwa? Choise answer!");
    
    await ctx.reply("We wotching for you!", {
        reply_markup: shareKeyboard,
    });
})

bot.on(':contact', async (ctx) => {
    await ctx.reply('Thanks for you number, bro. We make phon you all time!')
})

bot.command('inline_keyboard', async (ctx) => {
    // const inlineKeyboard = new InlineKeyboard()
    // .text('1', 'button-1')
    // .row()
    // .text('2', 'button-2')
    // .row()
    // .text('3', 'button-3')
    // .text('4', 'button-4'); 

    const inlineK = new InlineKeyboard().url('Go to url: ', 'https://github.com/cheremkha')

    await ctx.reply('touch button', {
        reply_markup: inlineK
    });
})

bot.callbackQuery('button-1', async (ctx) => {
    await ctx.answerCallbackQuery('Good job, my litle bro');
    await ctx.reply ('You choice the number')
})


// bot.on('callback_query:data', async (ctx) => {
//      await ctx.answerCallbackQuery();
//     await ctx.reply (`You choice number ${ctx.callbackQuery.data}`)
// })

bot.catch( (err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}`);
    const e = err.error;

    if(e instanceof GrammyError) {
        console.error('Error in request: ', e.description);
    } else if (e instanceof HttpError) {
        console.error('Could not contact Telegram: ', e);
    } else {
        console.error("Unknown error: ", e);
    }
})

bot.start();


const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bot is running\n');
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});