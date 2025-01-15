import { priceList, YesNoType } from "@/app/constants";
import Slot, { ISlot } from "../models/Slot";
import cache from "./cache";
import { getDateDifferenceFromString } from "./dateUtils";

export async function chargeCalculator(formSubmission: any) {
    let slots: ISlot[] | null;
    const cachedSlots: ISlot[] | null = cache.get("slots") as ISlot[];
    if (!cachedSlots) {
        slots = await Slot.find({});
        cache.set("slots", slots);
    }
    else {
        slots = cachedSlots;
    }
    const foodPrice = (formSubmission.isFoodRequired === YesNoType.Yes && formSubmission.startDate && formSubmission.endDate) ?
        formSubmission.groupSize * priceList["PR"].foodFees["REGULAR"] * getDateDifferenceFromString(formSubmission.startDate, formSubmission.endDate)
        : 0;

    const accommodationPrice = (formSubmission.isPartialRetreat === YesNoType.No && formSubmission.isAccommodationRequired === YesNoType.Yes && formSubmission.roomQuantity != null && formSubmission.roomQuantity != undefined) ?
        slots.reduce<number>((acc: number, slot: ISlot, idx: number, slotArr: ISlot[]): number => {
            if (formSubmission.roomQuantity) {
                return acc + formSubmission.roomQuantity[slot.bedType] * priceList["FRWA"][slot.bedType];
            }
            return acc;
        }, 0)
        : 0;
    const partialRetreatPrice = (formSubmission.isPartialRetreat === YesNoType.Yes && formSubmission.startDate && formSubmission.endDate) ?
        formSubmission.groupSize * priceList["PR"].partialRegistrationCharges * getDateDifferenceFromString(formSubmission.startDate, formSubmission.endDate)
        : 0;
    const departureLunchPrice = formSubmission.isDepartureLunchRequired === YesNoType.Yes ? formSubmission.groupSize * priceList.departureLunch : 0;
    const arrivalLunchPrice = formSubmission.isArrivalLunchRequired === YesNoType.Yes ? formSubmission.groupSize * priceList.arrivalLunch : 0;
    const totalPrice = partialRetreatPrice + foodPrice + accommodationPrice + departureLunchPrice + arrivalLunchPrice;
    const discount = formSubmission.discount ? totalPrice * formSubmission.discount / 100 : 0;
    const finalPrice = totalPrice - discount;
    return { foodPrice, accommodationPrice, partialRetreatPrice, departureLunchPrice, arrivalLunchPrice, totalPrice, discount, finalPrice };
}