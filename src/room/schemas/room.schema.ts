import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({ timestamps: true })
export class Room {

    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop({ type: [String] })
    users: [string];

    @Prop()
    roomName: string;

    @Prop()
    lastMessage?: string;

    /*
    @Prop({ type: SchemaTypes.ObjectId })
    partnerId: Types.ObjectId;
    */
}

export type RoomDocument = Room & Document;
export const RoomSchema = SchemaFactory.createForClass(Room);