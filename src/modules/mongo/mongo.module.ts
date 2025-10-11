import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoClient } from "mongodb";
import schemas from "./schema.module";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                const mongoUrl = config.getOrThrow<string>('mongo.uri')
                const username = config.get<string>('mongo.username')
                const password = config.get<string>('mongo.password')

                const connectionOptions: any = {
                    uri: mongoUrl,
                    dbName: config.getOrThrow<string>('mongo.db')
                }

                if (username && password) {
                    connectionOptions.auth = {
                        username,
                        password
                    }
                    connectionOptions.authSource = 'admin'
                }

                const client = new MongoClient(mongoUrl, username && password ? {
                    auth: {
                        username,
                        password
                    }
                } : {})

                try {
                    await client.connect()
                    return connectionOptions
                } catch (error) {
                    throw new Error(`Failed to connect to MongoDb: ${error}`)
                }
            }
        }),
        ...schemas
    ],
    exports: [MongooseModule, ...schemas]
})
export class MongoModule {}