import mongoose, {Schema, model, models} from "mongoose";
import { BedType } from "@/app/constants";

const SlotSchema = new Schema({
    bedType: {type: String, enum: Object.values(BedType), required: true},
    totalCapacity: {type: Number, required: true},
    available: {type: Number, required: true},
    hold: {type: Number, required: true, defaultValue:0},
    price: {type: Number, required: true}
})

type ISlot = mongoose.InferSchemaType<typeof SlotSchema>;

const Slot = models.Slot || model<ISlot>("Slot",SlotSchema);
export default Slot;
export type {ISlot};