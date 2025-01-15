import mongoose, {Schema, model, models} from "mongoose";
import { BedType } from "@/app/constants";

const SlotSchema = new Schema({
    bedType: {type: String, enum: Object.values(BedType), required: true},
    spotsAvailable: {type: Number, required: true},
    totalCapacity: {type: Number, required: true},
    neutralSpotsAvailable: {type: Number, required: true},
    maleSpotsAvailable: {type: Number, required: true},
    femaleSpotsAvailable: {type: Number, required: true},
    maleSpotsHold: {type: Number, required: true, defaultValue:0},
    femaleSpotsHold: {type: Number, required: true, defaultValue:0},
})

type ISlot = mongoose.InferSchemaType<typeof SlotSchema>;

const Slot = models.Slot || model<ISlot>("Slot",SlotSchema);
export default Slot;
export type {ISlot};