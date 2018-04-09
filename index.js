const Discord = require("discord.js");
const YTDL = require("ytdl-core")


const PREFIX = "$"

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var fortunes = [
    "Sim",
    "Não",
    "Talvez",
    "Sei lá, vai se fuder"
];

var cara = [
    "CARA",
    "COROA"
];

var bot = new Discord.Client(); 

var servers = {};

var hex = '#'+Math.floor(Math.random()*16777215).toString(16);

bot.on('ready', () => {
    console.log("Estou pronto PORRA!")
    bot.user.setActivity('o sallum no lixo')
    bot.user.setStatus('dnd');
    /*var Count;
    for(Count in bot.users.array()){
       var uso = bot.users.array()[Count];
       console.log(uso.username + " ESTA " + uso.presence.status);
    }*/
});

bot.on('guildMemberAdd', member => {
    member.send("Para ser aprovado no servidor, basta enviar uma mensagem para <@412582853834965003>, <@356977176635244555> ou <@319256311298785290> falando seu nome verdadeiro");
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage("Pong!")
            break;
        case "ajuda":
            message.author.sendMessage("vai se fuder")
            break; 
        case "avatar":
            var avatar = message.author.avatarURL;
            var embed = new Discord.RichEmbed()
            .setColor(hex)
            .setTitle(message.author.username)
            .setImage(avatar);
            message.channel.send({embed});
            break;
        case "online":
            const membroson = message.guild.members.filter(user => user.presence.status === "online").map(u => u.user.username).join("\n")
            const membrosid = message.guild.members.filter(user => user.presence.status === "idle").map(u => u.user.username).join("\n")
            const membrosdnd = message.guild.members.filter(user => user.presence.status === "dnd").map(u => u.user.username).join("\n")
            message.channel.send("**Membros ONLINE\n\n**" + "\n" + membroson + "\n" + membrosid + membrosdnd);
            break;
        case "vsf":
            message.channel.send("vsf vc");
            break;
        case "status":
            var juj = message.author.presence.status
            if (juj === 'online') {message.channel.sendMessage("Seu status: **ONLINE**")}
            if (juj === 'idle') {message.channel.sendMessage("Seu status: **AUSENTE**")}
            if (juj === 'dnd') {message.channel.sendMessage("Seu status: **NÃO PERTUBE**")}
            if (juj === 'offline') {message.channel.sendMessage("Seu status: **OFFLINE**")}
            break;
        case "jogos":
            message.channel.sendMessage("https://discord.gg/e8rMuKw");
            break;
        case "moeda":
            message.channel.sendMessage(cara[Math.floor(Math.random() * cara.length)]);
            break;  
        case "1502005/:":
            var cargo = message.guild.roles.find("name", "ALUNOS") ;
            message.member.addRole(cargo) ;
            message.author.sendMessage("Seu código foi aprovado")
            msgDel = 1;
            let numberMessage = parseInt(msgDel);
            message.channel.fetchMessages({limit: numberMessage}).then(messages => message.channel.bulkDelete(messages));
            break;
        case "apagar":
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
            const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
            if (!amount) return message.reply('Especifique o tanto de mensagens que devo apagar');
            message.channel.fetchMessages({
            limit: amount,
            }).then((messages) => {
            message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
            message.channel.send(`${amount} mensagens excluídas`).then(msg => msg.delete(5000));});}
            else {(message.reply("Você não tem permissão para esse comando"));}
            break;
        case "fale":
            const iri = message.content.split(" ").join(" ").slice(5);
            if (args[1]) {message.channel.sendMessage(`${iri}`);}
            else {message.channel.send("escreva alguma coisa para eu dizer");}
            break;      
        case "vote":
            const agree = "✅";
            const disagree = "❎";
            if (args[1]) {
                message.react(agree)
                message.react(disagree)}
            else {message.channel.sendMessage("É nessessário escrver algo para votar")}
            break;
        case "pergunta":
            if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
            else message.channel.sendMessage("Não consigo responder isso, seja mais expecífico"); 
            break;
        case "toque":
            if (!args[1]) {
                message.channel.sendMessage("É nessessário adicionar um link");
                return;}
            if (!message.member.voiceChannel) {
                message.channel.sendMessage("É nessessário estar conectado a um canal de voz");
                return;}
            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
            var server = servers[message.guild.id];
            server.queue.push(args[1]);
            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);});
            break;
        case "proxima":
            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            break;
        case "pare":
            var server = servers[message.guild.id];
            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        default:
            message.reply("Comando inválido");
    } 
});

bot.login(process.env.BOT_TOKEN);
