import { AccommodationType, GenderType, TravelType, YesNoType } from "@/app/constants";
import {PersonalDetails} from "@/app/components/PersonalDetailsForm";
import mongoose, { Schema, model, models } from "mongoose";

const RoomQuantitySchema = new Schema({
  "2AB": {type: "string", required: true},
  "3AB": {type: "string", required: true},
  "4AB": {type: "string", required: true},
  "6NAB": {type: "string", required: true}
})
const PersonalDetailsSchema = new Schema({
  devoteeName: { type: "string", required: true},
  name: { type: "string", required: true },
  dob: { type: "string", required: true },
  nationality: { type: "string", required: true },
  gender: { type: "string", required: false },
  spiritualMaster: { type: "string", required: true },
  findRetreat: {type: "string", required: false},
  startYear: { type: "string", required: true },
  address: { type: "string", required: true },
  whatsappNumber: { type: "string", required: true },
  isSnore: { type: "string", required: false },
  idCopy: { type: "string", required: true },
  isVolunteer: { type: "string", required: false },
  occupation: { type: "string", required: false },
  sevaType: { type: "string", required: false },
  otherSevaType: { type: "string", required: false }
})
const FormSubmissionSchema = new Schema({
  email: { type: String, required: true },
  groupSize: { type: Number, required: true },
  travelType: {type: String, required: false},
  isAccommodationRequired: {type: Boolean, required:true},
  roomQuantity: {type: RoomQuantitySchema, required: false},
  isFoodRequired: {type: String, required: false},
  isPartialRetreat: {type: String, required: false},
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  isArrivalLunchRequired: {type: String, required: false},
  isDepartureLunchRequired: {type: String, required: false},
  donationAmount: {type: Number, required: false},
  suggestions: {type: String, required: false},
  coupon: {type: String, required: false},
  charges: {type: Number, required: false},
  personalDetails: [PersonalDetailsSchema],
  createdAt: { type: Date, default: Date.now },
});

type IFormSubmission = mongoose.InferSchemaType<typeof FormSubmissionSchema>;

const FormSubmission = models.FormSubmission || model<IFormSubmission>("FormSubmission", FormSubmissionSchema);

export default FormSubmission;
export type {IFormSubmission};