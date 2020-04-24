import Discord from "discord.js";
import { Message } from '../interfaces/discord';
import { Command } from '../interfaces/command';
import Youtube from 'simple-youtube-api';
import { youtube_api_key } from '../config.json';
import chalk from "chalk";
const ytClient = new Youtube(youtube_api_key);

const cmd: Command = {
    name: 'search',
    description: 'search!',
    async execute(message: Message, args: string[] = []) {
        let preSearchResults: any[] = await ytClient.searchVideos(args[0],5,  { part : 'contentDetails' });
        let searchResults: any[] = [];
        for (const result in preSearchResults) {
            let videoInfo = await ytClient.getVideo(preSearchResults[result].url);
            searchResults.push(videoInfo);
        }
        console.log(searchResults[0]);
        const listEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Información de reproducción del servidor`)
            .setAuthor('DJ Pinochet breo', 'https://www.biografiasyvidas.com/biografia/p/fotos/pinochet.jpg')
            .setDescription(
                searchResults.map((videoItem, index) => `#${index + 1} - ${videoItem.title}`)
            )
            .setTimestamp()
            .setFooter('HIGH IQ BRO?');

        message.channel.send(listEmbed);

        const filter = (m: Message) => {
            if (m.author.id !== message.author.id) return false;
            const messageContent = m.content.split(" ");
            let validMessage = true;
            for (const message of messageContent) {
                if (!(typeof (parseInt(message)) == 'number' && parseInt(message) > 0 && parseInt(message) <= 5)) {
                    validMessage = false;
                }
            }
            return validMessage;
        };
        let collection;
        try {
            collection = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] });
        } catch(e) {
            return message.channel.send("Pasaron 10 segundos antes de elegir las canciones, intentalo nuevamente")
        }
        
        let collectedMessage = collection.first()!.content;
        const messageContent = collectedMessage.split(" ");
        const musicVideos: any[] = searchResults.slice(0, messageContent.length)
        for (const video of musicVideos) {
            console.log(video.title)
        }
        


    }
}
module.exports = cmd;