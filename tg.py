from telegram import InlineKeyboardMarkup, InlineKeyboardButton, Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# Вставь сюда свой токен
TOKEN = "8132936313:AAGWYHDWV3QxRGR_CMSkspO0ccH7A1S-mXQ"

# URL твоего сайта
WEB_APP_URL = "https://radaevalexei.github.io/neiroset2_cats_web_app/"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [
            InlineKeyboardButton(
                text="Открыть сайт", web_app={"url": WEB_APP_URL}
            )
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        text="Привет! Нажми кнопку, чтобы открыть мой сайт:",
        reply_markup=reply_markup
    )

def main():
    app = ApplicationBuilder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))

    app.run_polling()

if __name__ == "__main__":
    main()