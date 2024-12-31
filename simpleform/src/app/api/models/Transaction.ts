import mongoose, {Schema, model, models} from "mongoose";

const TransactionSchema = new Schema({
    txnid: {type: String, required: true},
    mihpayid: {type: String, required: true},
    status: {type: String, required: true},
    mode: {type: String, required: true},
    bank_ref_num: {type: String, required: true}
})

type ITransaction = mongoose.InferSchemaType<typeof TransactionSchema>;

const Transaction = models.Transaction || model<ITransaction>("Transaction",TransactionSchema);
export default Transaction;
export type {ITransaction};