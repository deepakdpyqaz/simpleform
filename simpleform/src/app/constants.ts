const priceList = {
    foodFees: 100,
    arrivalLunch: 100,
    departureLunch: 100,
    partialRetreatCharges: 600

}
enum AccommodationType {
    Room = "Room",
    Dormatory = "Dormatory"
}

enum TravelType {
    Individual = "Individual",
    Group = "Group"
}

enum YesNoType {
    Yes = "Yes",
    No = "No"
}

enum GenderType{
    Male = "Male",
    Female = "Female"
}

enum BedType{
    AB2 = "2AB",
    AB3 = "3AB",
    AB4 = "4AB",
    NAB6 = "6NAB",
}

enum OperationType{
    Increase = "Increase",
    Decrease = "Decrease"
}

enum SubmitStatus{
    Pending,
    Submitted,
    Failed,
    InProgress
}
export {priceList, AccommodationType, TravelType, YesNoType, GenderType, BedType, OperationType, SubmitStatus};