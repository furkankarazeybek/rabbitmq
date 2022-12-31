const amqb=require("amqplib") //rabbitmq kullandığı mesajlaşma protokolü
const queueName = process.argv[2] || "jobsQueue";  //process.argv = ['node', 'yourscript.js', ...]

connect_rabbitmq();

//async fonk. çünkü birbirleriyle bağlantılı bir sürü sabit tanımlayacağız
async function connect_rabbitmq(){
    
    try{
        const connection = await amqb.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();  //channel oluşturulur
        const assertion = await channel.assertQueue(queueName); //kuyruk
    
        //publisherdan mesajın alınması
        console.log("Mesaj bekleniyor...");
        channel.consume(queueName, message => {
            console.log("Message",message.content.toString());
              channel.ack(message);  //mesajların tane tane alınmasını sağlar.
        })
    
    }
    catch(error){
       console.log("Error",error);
    }
   
}