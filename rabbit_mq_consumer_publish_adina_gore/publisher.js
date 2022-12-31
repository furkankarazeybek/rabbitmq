const amqb=require("amqplib") //rabbitmq kullandığı mesajlaşma protokolü

const message = {
    description : "Bu da daha farklı bir test mesajıdır.."
}

const queueName = process.argv[2] || "jobsQueue";  //process.argv = ['node', 'yourscript.js', ...]


connect_rabbitmq();

//async fonk. çünkü birbirleriyle bağlantılı bir sürü sabit tanımlayacağız
async function connect_rabbitmq(){
    
    try{
        const connection = await amqb.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();  //channel oluşturulur
        const assertion = await channel.assertQueue(queueName); //kuyruk ekle

        setInterval(()=> {
        message.description = new Date().getTime()    
          //kuyruğa mesajı gönder
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        console.log("Gonderilen mesaj",message);
        },1000)

    
    }
    catch(error){
       console.log("Error",error);
    }
   
}