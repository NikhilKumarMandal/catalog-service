import { Kafka, Producer } from "kafkajs";
import { MessageProducerBroker } from "../common/types/broker";


export class KafkaProducerBroker implements MessageProducerBroker {
    private producer: Producer

    constructor(clientId: string, brokers: string[]) {
        const kafka = new Kafka({ clientId, brokers });
        this.producer = kafka.producer();
    }

    /**
     * Connect the producer
     */
    async connect() {
        await this.producer.connect()
    }


    /**
     * disconnect the producer
     */

    async disconnect() {
        if (this.producer) {
            await this.producer.disconnect()
        }
    }

    /**
     * 
     * @param topic - the topic to send the message
     * @param message - the message to send
     * @param {Error} -  When the  producer is not connect
     */
    async sendMessage(topic: string, message: string) {
        await this.producer.send({
            topic,
            messages: [{value: message}]
        })
    }
}