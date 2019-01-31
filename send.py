import telebot
import json

bot = telebot.TeleBot('433138778:AAHSzZ8axkQzbg7L91B5ZOOjc9wIW-eNu2A')
with open('addr.txt') as f:
    addresses = [line.split(' ') for line in f.read().split('\n')]
print(addresses)
for addr in addresses:
    with open('../message.zip', 'rb') as doc:
        print(addr)
        bot.send_document(addr[1], doc)
        print('Archive sent to '+addr[0])


@bot.message_handler()
def ass(message):
    print(message.chat.id)
if __name__ == '__main__':
    bot.polling(none_stop=True)