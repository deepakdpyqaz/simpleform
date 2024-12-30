import mongoose, {Schema, model, models} from "mongoose";

const CouponSchema = new Schema({
    name: {type: String, required: true},
    pct: {type: Number, required: true}
})

type ICoupon = mongoose.InferSchemaType<typeof CouponSchema>;

const Coupon = models.Coupon || model<ICoupon>("Coupon",CouponSchema);
export default Coupon;
export type {ICoupon};