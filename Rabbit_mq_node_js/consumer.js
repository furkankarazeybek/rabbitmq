const amqb=require("amqplib") //rabbitmq kullandığı mesajlaşma protokolü
const queueName = process.argv[2] || "jobsQueue";  //process.argv = ['node', 'yourscript.js', ...]
const data = require("./data.json");

/* 
data.json içerisindeki tüm verileri publish ettiğimizde birden fazla aynı
kuyruğa bağlı(örneğin queue1) consumer birlikte mesajları tüketmeye çalışır. Yani hepsi birden
farklı mesajları alarak kuyruğun tükenmesi amaçlanır.

node publish.js queue1  -- node consumer.js "queue1" ile aynı kuyruk mesajları alınır.
node publish.js queue2  -- node consumer.js "queue2"

*/


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
                const messageInfo = JSON.parse(message.content.toString());
                const userInfo = data.find(u => u.id = messageInfo.description)

                if(userInfo) {
                    console.log("İşlenen kayıt", userInfo);
                    channel.ack(message);  //mesajların tane tane alınmasını sağlar.
                }

                       })
    
    }
    catch(error){
       console.log("Error",error);
    }
   
}