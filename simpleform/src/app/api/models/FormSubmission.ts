import { AccommodationType, GenderType, RegistrationType, TravelType, YesNoType } from "@/app/constants";
import {PersonalDetails} from "@/app/components/PersonalDetailsForm";
import mongoose, { Schema, model, models } from "mongoose";

const RoomQuantitySchema = new Schema({
  "2AB": {type: "number", required: true, default: 0},
  "3AB": {type: "number", required: true, default: 0},
  "4AB": {type: "number", required: true, default: 0},
  "6NAB": {type: "number", required: true, default: 0}
})
const PersonalDetailsSchema = new Schema({
  devoteeName: { type: "string", required: false, default: ''},
  name: { type: "string", required: true },
  dob: { type: "string", required: true },
  nationality: { type: "string", required: true },
  gender: { type: "string", required: false },
  spiritualMaster: { type: "string", required: false },
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
  groupSize: { type: Number, required: true, default: 1 },
  travelType: {type: String, required: false, default: "Individual"},
  registrationType: { type: String, required: true},
  isAccommodationRequired: {type: String, required:true, default: "No"},
  roomQuantity: {type: RoomQuantitySchema, required: false },
  isFoodRequired: {type: String, required: false, default: "No"},
  isPartialRetreat: {type: String, required: false, default: "No"},
  foodType: {type: String, required: false, default: "NONE"},
  startDate: { type: String, required: false },
  endDate: { type: String, required: false },
  isArrivalLunchRequired: {type: String, required: false},
  isDepartureLunchRequired: {type: String, required: false},
  donationAmount: {type: [String], required: false},
  suggestions: {type: String, required: false},
  coupon: {type: String, required: false},
  discount: {type: Number, required: false, default: 0},
  charges: {type: Number, required: true, default: 0},
  personalDetails: [PersonalDetailsSchema],
  status: {type: String, enum: ["success", "failure", "pending"], required: false, default: "pending"},
  createdAt: { type: Date, default: Date.now },
});

type IFormSubmission = mongoose.InferSchemaType<typeof FormSubmissionSchema>;

const FormSubmission = models.FormSubmission || model<IFormSubmission>("FormSubmission", FormSubmissionSchema);

export default FormSubmission;
export type {IFormSubmission};